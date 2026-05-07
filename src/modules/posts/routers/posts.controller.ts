import { Request, Response } from "express";
import { getMatchedQuery } from "../../../core/utils/get-matched-query";
import {
  CreatePostInput,
  PostsQueryInput,
  PostViewModel,
} from "../domain/post.types";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { errorHandler } from "../../../core/errors/error.handler";
import { PagedOutput } from "../../../core/types/page-and-sort";
import {
  CommentsQueryInput,
  CommentViewModel,
  CreateCommentInput,
} from "../../comments/domain/comment.types";
import { ResultStatus } from "../../../core/types/result";
import { mapResultToHttpStatus } from "../../../core/utils/map-result-to-http-status";
import { PostsQueryRepository } from "../repositories/posts.query.repository";
import { CommentsQueryRepository } from "../../comments/repositories/comments.query.repository";
import { PostsService } from "../application/posts.service";
import { CommentService } from "../../comments/application/comments.service";
import { inject, injectable } from "inversify";
import { LikeInput } from "../../like/domain/like.types";

@injectable()
export class PostsController {
  constructor(
    @inject(PostsQueryRepository)
    public postsQueryRepository: PostsQueryRepository,
    @inject(CommentsQueryRepository)
    public commentsQueryRepository: CommentsQueryRepository,
    @inject(PostsService)
    public postsService: PostsService,
    @inject(CommentService)
    public commentService: CommentService,
  ) {}

  async getPosts(req: Request, res: Response) {
    try {
      const userId = req.userMetaData?.id;

      const matchedQuery = getMatchedQuery<PostsQueryInput>(req);
      const posts = await this.postsQueryRepository.getAll(
        matchedQuery,
        userId,
      );

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
      const userId = req.userMetaData?.id;

      const postView = await this.postsQueryRepository.getById(
        req.params.id,
        userId,
      );

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
      const userId = req.userMetaData?.id;

      const post = await this.postsQueryRepository.getById(postId, userId);

      if (!post) {
        return res.sendStatus(HTTP_STATUS.notFound);
      }

      const matchedQuery = getMatchedQuery<CommentsQueryInput>(req);

      const result = await this.commentsQueryRepository.getCommentsByPost(
        postId,
        matchedQuery,
        userId,
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
      const userId = req.userMetaData?.id;

      const postId = await this.postsService.createPost(req.body);
      const postView = await this.postsQueryRepository.getById(postId, userId);

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
        userId,
      );

      return res.status(HTTP_STATUS.created).send(commentResult.data);
    } catch (e) {
      errorHandler(e, res);
    }
  }

  async updateLikeStatus(
    req: Request<{ id: string }, {}, LikeInput>,
    res: Response,
  ) {
    try {
      const commentId = req.params.id;
      const userId = req.userMetaData!.id;
      const likeStatus = req.body.likeStatus;

      const result = await this.postsService.updateLikeStatus(
        userId,
        commentId,
        likeStatus,
      );

      if (result.status !== ResultStatus.NoContent) {
        return res.sendStatus(mapResultToHttpStatus(result.status));
      }

      return res.sendStatus(HTTP_STATUS.noContent);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
