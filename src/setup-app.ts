import express, { Application } from "express";
import { routes } from "./core/const/routes";
import { blogsRouter } from "./modules/blogs/routers/blogs.router";
import { clearDbRouter } from "./modules/testing/clear-db.router";
import { postsRouter } from "./modules/posts/routers/posts.router";
import { authRouter } from "./auth/routers/auth.router";
import { usersAdminAuthRouter } from "./modules/users/routers/users.router";
import { commentsRouter } from "./modules/comments/routers/comments.router";
import cookieParser from "cookie-parser";
import { express as useragent } from "express-useragent";
import { sessionsRouter } from "./modules/sessions/routers/sessions.router";

export const setupApp = (app: Application) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(useragent());
  app.set("trust proxy", true); // для корректного опрееления ip

  app.get("/", (_, res) => {
    res.status(200).send("Good luck!");
  });

  app.use("", authRouter);
  app.use(routes.deviceSessions, sessionsRouter);

  app.use(routes.blogs, blogsRouter);

  app.use(routes.posts, postsRouter);

  app.use(routes.comments, commentsRouter);

  app.use(routes.users, usersAdminAuthRouter);

  app.use(routes.testing, clearDbRouter);
};
