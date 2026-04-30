import { createResultObject } from "../../../core/utils/create-result-object";
import { Result, ResultStatus } from "../../../core/types/result";
import { CommentDb } from "../domain/comment.types";
import { CommentsRepository } from "../repositories/comments.repository";
import { ObjectId } from "mongodb";
import { PostsRepository } from "../../posts/repositories/posts.repository";
import { UsersRepository } from "../../users/repositories/users.repository";
import { inject, injectable } from "inversify";
import { CommentModel } from "../domain/comment.entity";

@injectable()
export class CommentService {
  usersRepository: UsersRepository;
  postsRepository: PostsRepository;
  commentsRepository: CommentsRepository;

  constructor(
    @inject(UsersRepository) usersRepository: UsersRepository,
    @inject(PostsRepository) postsRepository: PostsRepository,
    @inject(CommentsRepository) commentsRepository: CommentsRepository,
  ) {
    this.usersRepository = usersRepository;
    this.postsRepository = postsRepository;
    this.commentsRepository = commentsRepository;
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

    return createResultObject({ status: ResultStatus.NoContent });
  }

  async deleteManyComments(filter: Record<string, string>): Promise<void> {
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
}
