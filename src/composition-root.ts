import { CommentsController } from "./modules/comments/routers/comments.controller";
import { CommentService } from "./modules/comments/application/comments.service";
import { CommentsQueryRepository } from "./modules/comments/repositories/comments.query.repository";
import { CommentsRepository } from "./modules/comments/repositories/comments.repository";
import { PostsRepository } from "./modules/posts/repositories/posts.repository";
import { UsersRepository } from "./modules/users/repositories/users.repository";
import { PostsQueryRepository } from "./modules/posts/repositories/posts.query.repository";
import { PostsController } from "./modules/posts/routers/posts.controller";
import { PostsService } from "./modules/posts/application/posts.service";
import { BlogsQueryRepository } from "./modules/blogs/repositories/blogs.query.repository";
import { BlogsController } from "./modules/blogs/routers/blogs.controller";
import { BlogsService } from "./modules/blogs/application/blogs.service";
import { BlogsRepository } from "./modules/blogs/repositories/blogs.repository";

export const postsQueryRepository = new PostsQueryRepository();
export const commentsQueryRepository = new CommentsQueryRepository();
export const blogsQueryRepository = new BlogsQueryRepository();

export const usersRepository = new UsersRepository();
export const commentsRepository = new CommentsRepository();
export const postsRepository = new PostsRepository();
export const blogsRepository = new BlogsRepository();

export const commentService = new CommentService(
  usersRepository,
  postsRepository,
  commentsRepository,
);

export const postsService = new PostsService(
  blogsQueryRepository,
  postsRepository,
  commentService,
);

export const postsController = new PostsController(
  postsQueryRepository,
  commentsQueryRepository,
  postsService,
  commentService,
);

export const commentsController = new CommentsController(
  commentsQueryRepository,
  commentService,
);

export const blogsService = new BlogsService(
  blogsRepository,
  commentService,
  postsService,
);

export const blogsController = new BlogsController(
  blogsQueryRepository,
  postsQueryRepository,
  blogsService,
  postsService,
);
