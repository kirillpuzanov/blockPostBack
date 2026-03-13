import { Request, Response } from "express";
import { CommentViewModel } from "../../types/comment.types";
import { errorHandler } from "../../../../core/errors/error.handler";
import { ResultStatus } from "../../../../core/types/result";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { commentsQueryRepository } from "../../repositories/comments.query.repository";

export const getCommentHandler = async (
  req: Request<{ id: string }, CommentViewModel | null>,
  res: Response,
) => {
  try {
    const result = await commentsQueryRepository.getById(req.params.id);

    if (result.status === ResultStatus.Success) {
      return res.status(HTTP_STATUS.ok).send(result.data);
    }
    return res.status(HTTP_STATUS.notFound);
  } catch (error) {
    errorHandler(error, res);
  }
};
