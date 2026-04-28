import { ObjectId, WithId } from "mongodb";
import {
  CommentDb,
  CommentsQueryInput,
  CommentViewModel,
} from "../types/comment.types";
import { commentCollection } from "../../../db/database";
import { createResultObject } from "../../../core/utils/create-result-object";
import { Result, ResultStatus } from "../../../core/types/result";
import { PagedOutput } from "../../../core/types/page-and-sort";
import { getPaginatedOutput } from "../../../core/utils/get-paginated-output";
import { PostsQueryRepository } from "../../posts/repositories/posts.query.repository";
import { inject, injectable } from "inversify";

@injectable()
export class CommentsQueryRepository {
  constructor(
    @inject(PostsQueryRepository)
    public postsQueryRepository: PostsQueryRepository,
  ) {}

  async getById(id: string): Promise<Result<CommentViewModel>> {
    const comment = await commentCollection.findOne({ _id: new ObjectId(id) });

    if (!comment) {
      return createResultObject({
        status: ResultStatus.NotFound,
      });
    }

    return createResultObject({
      status: ResultStatus.Success,
      data: this._mapToCommentView(comment),
    });
  }

  async getCommentsByPost(
    postId: string,
    query: CommentsQueryInput,
  ): Promise<Result<PagedOutput<CommentViewModel>>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;

    const post = await this.postsQueryRepository.getById(postId);

    if (!post) {
      return createResultObject({
        status: ResultStatus.NotFound,
      });
    }

    const skip = (pageNumber - 1) * pageSize;

    const commentsByPost = await commentCollection
      .find({ postId })
      .sort([sortBy, sortDirection])
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const totalCount = await commentCollection.countDocuments({ postId });

    const commentsByPostView = commentsByPost.map(this._mapToCommentView);
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

  _mapToCommentView(comment: WithId<CommentDb>): CommentViewModel {
    return {
      id: comment._id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      commentatorInfo: comment.commentatorInfo,
    };
  }
}
