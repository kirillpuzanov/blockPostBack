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
import { UsersController } from "./modules/users/routers/users.controller";
import { UsersQueryRepository } from "./modules/users/repositories/users.query.repository";
import { UsersService } from "./modules/users/application/users.service";
import { SessionsRepository } from "./modules/sessions/repositories/sessions.repository";
import { BcryptService } from "./auth/utils/bcrypt.service";
import { SessionsController } from "./modules/sessions/routers/sessions.controller";
import { SessionsService } from "./modules/sessions/application/sessions.service";
import { JwtService } from "./auth/utils/jwt.service";

export const bcryptService = new BcryptService();
export const jwtService = new JwtService();

export const postsQueryRepository = new PostsQueryRepository();
export const commentsQueryRepository = new CommentsQueryRepository();
export const blogsQueryRepository = new BlogsQueryRepository();
export const usersQueryRepository = new UsersQueryRepository();

export const usersRepository = new UsersRepository();
export const commentsRepository = new CommentsRepository();
export const postsRepository = new PostsRepository();
export const blogsRepository = new BlogsRepository();
export const sessionsRepository = new SessionsRepository();

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

export const usersService = new UsersService(
  usersRepository,
  sessionsRepository,
  bcryptService,
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

export const sessionsService = new SessionsService(
  sessionsRepository,
  jwtService,
);

export const blogsController = new BlogsController(
  blogsQueryRepository,
  postsQueryRepository,
  blogsService,
  postsService,
);

export const usersController = new UsersController(
  usersQueryRepository,
  usersService,
);

export const sessionsController = new SessionsController(sessionsService);
