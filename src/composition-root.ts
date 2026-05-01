import "reflect-metadata";
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
import { AuthController } from "./auth/routers/auth.controller";
import { MailTemplates } from "./auth/utils/mail-templates";
import { MailService } from "./auth/utils/mail.service";
import { AuthService } from "./auth/application/auth.service";
import { Container } from "inversify";
import { LikeQueryRepository } from "./modules/like/repositories/like.query.repository";
import { LikeService } from "./modules/like/application/like.service";
import { LikeRepository } from "./modules/like/repositories/like.repository";

export const container: Container = new Container();

// --- utils-services
container.bind(BcryptService).to(BcryptService);
container.bind(JwtService).to(JwtService);
container.bind(MailTemplates).to(MailTemplates);
container.bind(MailService).to(MailService);

// --- query repositories
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);
container.bind(LikeQueryRepository).to(LikeQueryRepository);

// ---  repositories
container.bind(UsersRepository).to(UsersRepository);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(PostsRepository).to(PostsRepository);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(SessionsRepository).to(SessionsRepository);
container.bind(LikeRepository).to(LikeRepository);

// --- services
container.bind(CommentService).to(CommentService);
container.bind(PostsService).to(PostsService);
container.bind(UsersService).to(UsersService);
container.bind(BlogsService).to(BlogsService);
container.bind(SessionsService).to(SessionsService);
container.bind(AuthService).to(AuthService);
container.bind(LikeService).to(LikeService);

// --- controllers
container.bind(PostsController).to(PostsController);
container.bind(CommentsController).to(CommentsController);
container.bind(BlogsController).to(BlogsController);
container.bind(UsersController).to(UsersController);
container.bind(AuthController).to(AuthController);
container.bind(SessionsController).to(SessionsController);
