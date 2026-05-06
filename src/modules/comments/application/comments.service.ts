import { createResultObject } from "../../../core/utils/create-result-object";
import { Result, ResultStatus } from "../../../core/types/result";
import { CommentDb } from "../domain/comment.types";
import { CommentsRepository } from "../repositories/comments.repository";
import { ObjectId } from "mongodb";
import { PostsRepository } from "../../posts/repositories/posts.repository";
import { UsersRepository } from "../../users/repositories/users.repository";
import { inject, injectable } from "inversify";
import { CommentModel } from "../domain/comment.entity";
import { LikeStatus } from "../../like/domain/like.types";
import { LikeService } from "../../like/application/like.service";

@injectable()
export class CommentService {
  usersRepository: UsersRepository;
  postsRepository: PostsRepository;
  commentsRepository: CommentsRepository;
  likeService: LikeService;

  constructor(
    @inject(UsersRepository) usersRepository: UsersRepository,
    @inject(PostsRepository) postsRepository: PostsRepository,
    @inject(CommentsRepository) commentsRepository: CommentsRepository,
    @inject(LikeService) likeService: LikeService,
  ) {
    this.usersRepository = usersRepository;
    this.postsRepository = postsRepository;
    this.commentsRepository = commentsRepository;
    this.likeService = likeService;
  }

  async createComment(
    userId: string,
    postId: string,
    content: string,
  ): Promise<Result<{ commentId: string }>> {
    const post = await this.postsRepository.getById(postId);
    const user = await this.usersRepository.getById(userId);

    if (!post || !user) {
      return createResultObject({
        status: ResultStatus.NotFound,
      });
    }

    const comment: CommentDb = {
      postId,
      content,
      blogId: post.blogId,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    };

    const commentId = await this.commentsRepository.create(comment);

    return createResultObject({
      status: ResultStatus.Created,
      data: { commentId },
    });
  }

  async updateComment(
    userId: string,
    commentId: string,
    content: string,
  ): Promise<Result<null>> {
    const avaLiableResult = await this._availabilityCheck(userId, commentId);

    if (avaLiableResult.status !== ResultStatus.Success) {
      /** статус будет NotFound или Forbidden */
      return avaLiableResult;
    }

    const updatedCount = await this.commentsRepository.update(
      commentId,
      content,
    );

    if (updatedCount < 1) {
      return createResultObject({ status: ResultStatus.NotFound });
    }

    return createResultObject({ status: ResultStatus.NoContent });
  }

  async deleteComment(
    userId: string,
    commentId: string,
  ): Promise<Result<null>> {
    const avaLiableResult = await this._availabilityCheck(userId, commentId);

    if (avaLiableResult.status !== ResultStatus.Success) {
      /** статус будет NotFound или Forbidden */
      return avaLiableResult;
    }

    const deletedCount = await this.commentsRepository.deleteOne(commentId);
    if (deletedCount < 1) {
      return createResultObject({ status: ResultStatus.NotFound });
    }
    await this.likeService.deleteEntityAllLikes(commentId);

    return createResultObject({ status: ResultStatus.NoContent });
  }

  async deleteManyComments(filter: Record<string, string>): Promise<void> {
    // todo - удалять также все лайки для удаленных комментов
    await CommentModel.deleteMany(filter);
    return;
  }

  async _availabilityCheck(
    userId: string,
    commentId: string,
  ): Promise<Result<null>> {
    const comment = await CommentModel.findOne({
      _id: new ObjectId(commentId),
    });

    /** такого коммента нет в БД */
    if (!comment) {
      return createResultObject({ status: ResultStatus.NotFound });
    }

    /** комментарий был создан не этим пользователем */
    if (comment.commentatorInfo?.userId !== userId) {
      return createResultObject({ status: ResultStatus.Forbidden });
    }

    return createResultObject({ status: ResultStatus.Success });
  }

  async updateLikeStatus(
    userId: string,
    commentId: string,
    newLikeStatus: LikeStatus,
  ): Promise<Result<null>> {
    const existingComment = await this.commentsRepository.findById(commentId);

    if (!existingComment) {
      return createResultObject({ status: ResultStatus.NotFound });
    }

    /** обновляем лайк / получаем дельту для изменения счетчика */
    const { status, data } = await this.likeService.updateLike(
      userId,
      commentId,
      newLikeStatus,
    );

    /** обновляем счетчик лайков комментария */
    if (
      data &&
      status === ResultStatus.NoContent &&
      Object.keys(data).length > 0
    ) {
      const updateInfo = {
        "likesInfo.likesCount": data.likesCount ?? 0,
        "likesInfo.dislikesCount": data.dislikesCount ?? 0,
      };
      await this.commentsRepository.updateLikes(commentId, updateInfo);
    }

    return createResultObject({ status: ResultStatus.NoContent });
  }
}
