import { Request, Response } from "express";
import { errorHandler } from "../../../../core/errors/error.handler";
import { commentService } from "../../application/comments.service";
import { ResultStatus } from "../../../../core/types/result";
import { mapResultToHttpStatus } from "../../../../core/utils/map-result-to-http-status";
import { HTTP_STATUS } from "../../../../core/const/statuses";

export const deleteCommentHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const commentId = req.params.id;
    const userId = req.userMetaData!.id;
    const result = await commentService.deleteComment(userId, commentId);

    if (result.status !== ResultStatus.NoContent) {
      return res.sendStatus(mapResultToHttpStatus(result.status));
    }

    return res.sendStatus(HTTP_STATUS.noContent);
  } catch (error) {
    errorHandler(error, res);
  }
};
