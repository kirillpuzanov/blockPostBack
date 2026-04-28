import { Request, Response } from "express";
import { CommentViewModel, UpdateCommentInput } from "../types/comment.types";
import { CommentsQueryRepository } from "../repositories/comments.query.repository";
import { ResultStatus } from "../../../core/types/result";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { errorHandler } from "../../../core/errors/error.handler";
import { CommentService } from "../application/comments.service";
import { mapResultToHttpStatus } from "../../../core/utils/map-result-to-http-status";
import { inject, injectable } from "inversify";

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsQueryRepository)
    public commentsQueryRepository: CommentsQueryRepository,
    @inject(CommentService)
    public commentService: CommentService,
  ) {}

  async getComment(
    req: Request<{ id: string }, CommentViewModel | null>,
    res: Response,
  ) {
    try {
      const result = await this.commentsQueryRepository.getById(req.params.id);

      if (result.status === ResultStatus.Success) {
        return res.status(HTTP_STATUS.ok).send(result.data);
      }
      return res.sendStatus(HTTP_STATUS.notFound);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async updateComment(
    req: Request<{ id: string }, CommentViewModel, UpdateCommentInput>,
    res: Response,
  ) {
    try {
      const commentId = req.params.id;
      const userId = req.userMetaData!.id;
      const content = req.body.content;

      const result = await this.commentService.updateComment(
        userId,
        commentId,
        content,
      );

      if (result.status !== ResultStatus.NoContent) {
        return res.sendStatus(mapResultToHttpStatus(result.status));
      }

      return res.sendStatus(HTTP_STATUS.noContent);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async deleteComment(req: Request<{ id: string }>, res: Response) {
    try {
      const commentId = req.params.id;
      const userId = req.userMetaData!.id;
      const result = await this.commentService.deleteComment(userId, commentId);

      if (result.status !== ResultStatus.NoContent) {
        return res.sendStatus(mapResultToHttpStatus(result.status));
      }

      return res.sendStatus(HTTP_STATUS.noContent);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
