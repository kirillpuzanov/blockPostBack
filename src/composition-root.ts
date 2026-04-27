import { CommentsController } from "./modules/comments/routers/comments.controller";
import { CommentService } from "./modules/comments/application/comments.service";
import { CommentsQueryRepository } from "./modules/comments/repositories/comments.query.repository";
import { CommentsRepository } from "./modules/comments/repositories/comments.repository";
import { PostsRepository } from "./modules/posts/repositories/posts.repository";
import { UsersRepository } from "./modules/users/repositories/users.repository";

/** users */
export const usersRepository = new UsersRepository();

/** posts */
export const postsRepository = new PostsRepository();

/** comments */
export const commentsQueryRepository = new CommentsQueryRepository();
export const commentsRepository = new CommentsRepository();
export const commentService = new CommentService(
  usersRepository,
  postsRepository,
  commentsRepository,
);
export const commentsController = new CommentsController(
  commentsQueryRepository,
  commentService,
);
