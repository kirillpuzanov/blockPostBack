import { Request, Response } from "express";
import { getMatchedQuery } from "../../../core/utils/get-matched-query";
import {
  CreatePostInput,
  PostsQueryInput,
  PostViewModel,
} from "../types/post.types";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { errorHandler } from "../../../core/errors/error.handler";
import { PagedOutput } from "../../../core/types/page-and-sort";
import {
  CommentsQueryInput,
  CommentViewModel,
  CreateCommentInput,
} from "../../comments/types/comment.types";
import { ResultStatus } from "../../../core/types/result";
import { mapResultToHttpStatus } from "../../../core/utils/map-result-to-http-status";
import { PostsQueryRepository } from "../repositories/posts.query.repository";
import { CommentsQueryRepository } from "../../comments/repositories/comments.query.repository";
import { PostsService } from "../application/posts.service";
import { CommentService } from "../../comments/application/comments.service";

export class PostsController {
  constructor(
    public postsQueryRepository: PostsQueryRepository,
    public commentsQueryRepository: CommentsQueryRepository,
    public postsService: PostsService,
    public commentService: CommentService,
  ) {}

  async getPosts(req: Request, res: Response) {
    try {
      const matchedQuery = getMatchedQuery<PostsQueryInput>(req);
      const posts = await this.postsQueryRepository.getAll(matchedQuery);

      res.status(HTTP_STATUS.ok).send(posts);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getPost(
    req: Request<{ id: string }, PostViewModel | null>,
    res: Response,
  ) {
    try {
      const postView = await this.postsQueryRepository.getById(req.params.id);

      res.status(HTTP_STATUS.ok).send(postView);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getCommentsByPost(
    req: Request<{ id: string }, PagedOutput<CommentViewModel>>,
    res: Response,
  ) {
    try {
      const postId = req.params.id;
      const matchedQuery = getMatchedQuery<CommentsQueryInput>(req);

      const result = await this.commentsQueryRepository.getCommentsByPost(
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
  }

  async createPost(
    req: Request<{}, PostViewModel, CreatePostInput>,
    res: Response,
  ) {
    try {
      const postId = await this.postsService.createPost(req.body);
      const postView = await this.postsQueryRepository.getById(postId);

      res.status(HTTP_STATUS.created).send(postView);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async updatePost(
    req: Request<{ id: string }, PostViewModel, CreatePostInput>,
    res: Response,
  ) {
    try {
      await this.postsService.updatePost(req.body, req.params.id);

      res.sendStatus(HTTP_STATUS.noContent);
      return;
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async deletePost(req: Request<{ id: string }>, res: Response) {
    try {
      await this.postsService.deletePost(req.params.id);
      res.sendStatus(HTTP_STATUS.noContent);
      return;
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async createCommentByPost(
    req: Request<{ id: string }, CommentViewModel, CreateCommentInput>,
    res: Response,
  ) {
    try {
      const postId = req.params.id;
      const { content } = req.body;
      const userId = req.userMetaData?.id;

      const createResult = await this.commentService.createComment(
        userId!,
        postId,
        content,
      );

      if (createResult.status !== ResultStatus.Created) {
        return res.sendStatus(mapResultToHttpStatus(createResult.status));
      }

      const commentResult = await this.commentsQueryRepository.getById(
        createResult.data!.commentId,
      );

      return res.status(HTTP_STATUS.created).send(commentResult.data);
    } catch (e) {
      errorHandler(e, res);
    }
  }
}
