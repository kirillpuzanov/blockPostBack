import { Request, Response } from "express";
import {
  CommentsQueryInput,
  CommentViewModel,
} from "../../../comments/types/comment.types";
import { getMatchedQuery } from "../../../../core/utils/get-matched-query";
import { ResultStatus } from "../../../../core/types/result";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { mapResultToHttpStatus } from "../../../../core/utils/map-result-to-http-status";
import { errorHandler } from "../../../../core/errors/error.handler";
import { PagedOutput } from "../../../../core/types/page-and-sort";
import { commentsQueryRepository } from "../../../../composition-root";

export const getCommentsByPostHandler = async (
  req: Request<{ id: string }, PagedOutput<CommentViewModel>>,
  res: Response,
) => {
  try {
    const postId = req.params.id;
    const matchedQuery = getMatchedQuery<CommentsQueryInput>(req);

    const result = await commentsQueryRepository.getCommentsByPost(
      postId,
      matchedQuery,
    );
    if (result.status === ResultStatus.Success) {
      return res.status(HTTP_STATUS.ok).send(result.data);
    }

    return res.sendStatus(mapResultToHttpStatus(result.status));
  } catch (e) {
    errorHandler(e, res);
  }
};
