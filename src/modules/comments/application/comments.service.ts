import { postsQueryRepository } from "../../posts/repositories/posts.query.repository";
import { createResultObject } from "../../../core/utils/create-result-object";
import { Result, ResultStatus } from "../../../core/types/result";
import { UserViewModel } from "../../users/types/user.types";
import { CommentDb } from "../types/comment.types";
import { commentsRepository } from "../repositories/comments.repository";

export const commentService = {
  async createComment(
    user: UserViewModel,
    postId: string,
    content: string,
  ): Promise<Result<{ commentId: string }>> {
    const post = await postsQueryRepository.getById(postId);

    if (!post) {
      return createResultObject({
        status: ResultStatus.NotFound,
      });
    }

    const comment: CommentDb = {
      postId,
      content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
    };

    const commentId = await commentsRepository.create(comment);

    return createResultObject({
      status: ResultStatus.Created,
      data: { commentId },
    });
  },
};
