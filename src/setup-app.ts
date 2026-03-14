import express, { Application } from "express";
import { routes } from "./core/const/routes";
import {
  blogsAdminAuthRouter,
  blogsPublicRouter,
} from "./modules/blogs/routers/blogs.router";
import { clearDbRouter } from "./modules/testing/clear-db.router";
import {
  postsAdminAuthRouter,
  postsAuthRouter,
  postsPublicRouter,
} from "./modules/posts/routers/posts.router";
import { authRouter } from "./auth/routers/auth.router";
import { usersAdminAuthRouter } from "./modules/users/routers/users.router";
import { commentsPublicRouter } from "./modules/comments/routers/comments.router";

export const setupApp = (app: Application) => {
  app.use(express.json());

  app.get("/", (_, res) => {
    res.status(200).send("Good luck!");
  });

  app.use("", authRouter);
  app.use(routes.blogs, blogsPublicRouter);
  app.use(routes.blogs, blogsAdminAuthRouter);

  app.use(routes.posts, postsPublicRouter);
  app.use(routes.posts, postsAdminAuthRouter);
  app.use(routes.posts, postsAuthRouter);

  app.use(routes.comments, commentsPublicRouter);

  app.use(routes.users, usersAdminAuthRouter);

  app.use(routes.testing, clearDbRouter);
};
