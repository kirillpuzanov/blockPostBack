import { Request, Response } from "express";
import {
  CommentViewModel,
  CreateCommentInput,
} from "../../../comments/types/comment.types";
import { commentService } from "../../../comments/application/comments.service";
import { ResultStatus } from "../../../../core/types/result";
import { commentsQueryRepository } from "../../../comments/repositories/comments.query.repository";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { mapResultToHttpStatus } from "../../../../core/utils/map-result-to-http-status";
import { errorHandler } from "../../../../core/errors/error.handler";

export const createCommentByPostHandler = async (
  req: Request<{ id: string }, CommentViewModel, CreateCommentInput>,
  res: Response,
) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    const userId = req.userMetaData?.id;

    const createResult = await commentService.createComment(
      userId!,
      postId,
      content,
    );

    if (createResult.status !== ResultStatus.Created) {
      return res.sendStatus(mapResultToHttpStatus(createResult.status));
    }

    const commentResult = await commentsQueryRepository.getById(
      createResult.data!.commentId,
    );

    return res.status(HTTP_STATUS.created).send(commentResult.data);
  } catch (e) {
    errorHandler(e, res);
  }
};
