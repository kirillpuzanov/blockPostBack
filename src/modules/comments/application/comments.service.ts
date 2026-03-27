import { postsQueryRepository } from "../../posts/repositories/posts.query.repository";
import { createResultObject } from "../../../core/utils/create-result-object";
import { Result, ResultStatus } from "../../../core/types/result";
import { CommentDb } from "../types/comment.types";
import { commentsRepository } from "../repositories/comments.repository";
import { commentCollection } from "../../../db/database";
import { ObjectId } from "mongodb";
import { usersQueryRepository } from "../../users/repositories/users.query.repository";

export const commentService = {
  async createComment(
    userId: string,
    postId: string,
    content: string,
  ): Promise<Result<{ commentId: string }>> {
    // todo переписать обращение к QueryRepo
    const post = await postsQueryRepository.getById(postId);
    const user = await usersQueryRepository.getById(userId);

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

    const commentId = await commentsRepository.create(comment);

    return createResultObject({
      status: ResultStatus.Created,
      data: { commentId },
    });
  },

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

    const updatedCount = await commentsRepository.update(commentId, content);

    if (updatedCount < 1) {
      return createResultObject({ status: ResultStatus.NotFound });
    }

    return createResultObject({ status: ResultStatus.NoContent });
  },

  async deleteComment(
    userId: string,
    commentId: string,
  ): Promise<Result<null>> {
    const avaLiableResult = await this._availabilityCheck(userId, commentId);

    if (avaLiableResult.status !== ResultStatus.Success) {
      /** статус будет NotFound или Forbidden */
      return avaLiableResult;
    }

    const deletedCount = await commentsRepository.deleteOne(commentId);
    if (deletedCount < 1) {
      return createResultObject({ status: ResultStatus.NotFound });
    }

    return createResultObject({ status: ResultStatus.NoContent });
  },

  async deleteManyComments(filter: Record<string, string>): Promise<void> {
    await commentCollection.deleteMany(filter);
    return;
  },

  async _availabilityCheck(
    userId: string,
    commentId: string,
  ): Promise<Result<null>> {
    const comment = await commentCollection.findOne({
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
  },
};
