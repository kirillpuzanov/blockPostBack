import { ObjectId, WithId } from "mongodb";
import {
  CommentDb,
  CommentsQueryInput,
  CommentViewModel,
} from "../domain/comment.types";
import { createResultObject } from "../../../core/utils/create-result-object";
import { Result, ResultStatus } from "../../../core/types/result";
import { PagedOutput } from "../../../core/types/page-and-sort";
import { getPaginatedOutput } from "../../../core/utils/get-paginated-output";
import { PostsQueryRepository } from "../../posts/repositories/posts.query.repository";
import { inject, injectable } from "inversify";
import { CommentModel } from "../domain/comment.entity";
import { LikeStatus, UserLikes } from "../../like/domain/like.types";
import { LikeQueryRepository } from "../../like/repositories/like.query.repository";

@injectable()
export class CommentsQueryRepository {
  constructor(
    @inject(PostsQueryRepository)
    public postsQueryRepository: PostsQueryRepository,
    @inject(LikeQueryRepository)
    public likeQueryRepository: LikeQueryRepository,
  ) {}

  async getById(
    id: string,
    userId: string | undefined,
  ): Promise<Result<CommentViewModel>> {
    const comment = await CommentModel.findOne({ _id: new ObjectId(id) });

    if (!comment) {
      return createResultObject({
        status: ResultStatus.NotFound,
      });
    }

    const userLikes = await this.likeQueryRepository.getUserLikes(userId, [
      comment._id.toString(),
    ]);

    return createResultObject({
      status: ResultStatus.Success,
      data: this._mapToCommentView(comment, userLikes),
    });
  }

  async getCommentsByPost(
    postId: string,
    query: CommentsQueryInput,
    userId: string | undefined,
  ): Promise<Result<PagedOutput<CommentViewModel>>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;

    const post = await this.postsQueryRepository.getById(postId);

    if (!post) {
      return createResultObject({
        status: ResultStatus.NotFound,
      });
    }

    const skip = (pageNumber - 1) * pageSize;

    const commentsByPost = await CommentModel.find({ postId })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();
    const totalCount = await CommentModel.countDocuments({ postId });

    const commentsIds = commentsByPost.map((el) => el._id.toString());
    const myLikes = await this.likeQueryRepository.getUserLikes(
      userId,
      commentsIds,
    );

    const commentsByPostView = commentsByPost.map((el) =>
      this._mapToCommentView(el, myLikes),
    );
    const paginatedOutput = getPaginatedOutput(commentsByPostView, {
      pageNumber,
      pageSize,
      totalCount,
    });

    return createResultObject({
      status: ResultStatus.Success,
      data: paginatedOutput,
    });
  }

  _mapToCommentView(
    comment: WithId<CommentDb>,
    myLikes: UserLikes,
  ): CommentViewModel {
    const mappedComment = {
      id: comment._id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      commentatorInfo: comment.commentatorInfo,
      likesInfo: comment.likesInfo,
    };

    return {
      ...mappedComment,
      likesInfo: {
        ...mappedComment.likesInfo,
        myStatus: myLikes[mappedComment.id] ?? LikeStatus.None,
      },
    };
  }
}
