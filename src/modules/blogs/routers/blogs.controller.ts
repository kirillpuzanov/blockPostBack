import { Request, Response } from "express";
import { getMatchedQuery } from "../../../core/utils/get-matched-query";
import {
  BlogQueryInput,
  BlogViewModel,
  CreateBlogInput,
} from "../types/blog.types";
import { BlogsQueryRepository } from "../repositories/blogs.query.repository";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { errorHandler } from "../../../core/errors/error.handler";
import { PagedOutput } from "../../../core/types/page-and-sort";
import {
  CreatePostByBlogInput,
  PostsByBlogQueryInput,
  PostViewModel,
} from "../../posts/domain/post.types";
import { PostsQueryRepository } from "../../posts/repositories/posts.query.repository";
import { PostsService } from "../../posts/application/posts.service";
import { BlogsService } from "../application/blogs.service";
import { inject, injectable } from "inversify";

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsQueryRepository)
    public blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsQueryRepository)
    public postsQueryRepository: PostsQueryRepository,
    @inject(BlogsService)
    public blogsService: BlogsService,
    @inject(PostsService)
    public postsService: PostsService,
  ) {}

  async getBlogs(req: Request, res: Response) {
    try {
      const matchedQuery = getMatchedQuery<BlogQueryInput>(req);
      const blogView = await this.blogsQueryRepository.getAll(matchedQuery);

      res.status(HTTP_STATUS.ok).send(blogView);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getBlog(
    req: Request<{ id: string }, BlogViewModel | null>,
    res: Response,
  ) {
    try {
      const blogView = await this.blogsQueryRepository.getById(req.params.id);

      res.status(HTTP_STATUS.ok).send(blogView);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getPostsByBlog(
    req: Request<{ blogId: string }, PagedOutput<PostViewModel>>,
    res: Response,
  ) {
    try {
      const blogId = req.params.blogId;
      const matchedQuery = getMatchedQuery<PostsByBlogQueryInput>(req);

      const postsByBlog = await this.postsQueryRepository.getPostsByBlog(
        blogId,
        matchedQuery,
      );
      res.status(HTTP_STATUS.ok).send(postsByBlog);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async createBlog(
    req: Request<{}, BlogViewModel, CreateBlogInput>,
    res: Response,
  ) {
    try {
      const blogId = await this.blogsService.createBlog(req.body);
      const blogView = await this.blogsQueryRepository.getById(blogId);
      res.status(HTTP_STATUS.created).send(blogView);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async updateBlog(
    req: Request<{ id: string }, BlogViewModel, CreateBlogInput>,
    res: Response,
  ) {
    try {
      const id = req.params.id;
      await this.blogsService.updateBlog(req.body, id);

      res.sendStatus(HTTP_STATUS.noContent);
      return;
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async deleteBlog(req: Request<{ id: string }>, res: Response) {
    try {
      const id = req.params.id;
      await this.blogsService.deleteBlog(id);
      res.sendStatus(HTTP_STATUS.noContent);
      return;
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async createPostByBlog(
    req: Request<{ blogId: string }, PostViewModel, CreatePostByBlogInput>,
    res: Response,
  ) {
    try {
      const blogId = req.params.blogId;
      const { content, shortDescription, title } = req.body;

      const createdPostId = await this.postsService.createPost({
        content,
        shortDescription,
        title,
        blogId,
      });
      const postView = await this.postsQueryRepository.getById(createdPostId);

      res.status(HTTP_STATUS.created).send(postView);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
