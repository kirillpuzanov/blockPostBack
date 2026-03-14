import { Request, Response } from "express";
import {
  CommentViewModel,
  UpdateCommentInput,
} from "../../types/comment.types";
import { errorHandler } from "../../../../core/errors/error.handler";
import { commentService } from "../../application/comments.service";
import { commentsQueryRepository } from "../../repositories/comments.query.repository";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { ResultStatus } from "../../../../core/types/result";
import { mapResultToHttpStatus } from "../../../../core/utils/map-result-to-http-status";

export const updateCommentHandler = async (
  req: Request<{ id: string }, CommentViewModel, UpdateCommentInput>,
  res: Response,
) => {
  try {
    const commentId = req.params.id;
    const userId = req.userMetaData?.id;
    const content = req.body.content;

    const comment = await commentsQueryRepository.getById(commentId);

    /** такого коммента нет в БД */
    if (!comment.data) {
      return res.sendStatus(HTTP_STATUS.notFound);
    }

    /** комментарий был создан не этим пользователем */
    if (comment.data.commentatorInfo.userId !== userId) {
      return res.sendStatus(HTTP_STATUS.forbidden);
    }

    const result = await commentService.updateComment(commentId, content);

    if (result.status !== ResultStatus.NoContent) {
      return res.sendStatus(mapResultToHttpStatus(result.status));
    }

    return res.sendStatus(HTTP_STATUS.noContent);
  } catch (error) {
    errorHandler(error, res);
  }
};
