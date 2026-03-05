import express, { Application } from "express";
import { routes } from "./core/const/routes";
import {
  blogsAuthRouter,
  blogsPublicRouter,
} from "./modules/blogs/routers/blogs.router";
import { clearDbRouter } from "./modules/testing/clear-db.router";
import {
  postsAuthRouter,
  postsBlogAuthRouter,
  postsBlogPublicRouter,
  postsPublicRouter,
} from "./modules/posts/routers/posts.router";

export const setupApp = (app: Application) => {
  app.use(express.json());

  app.get("/", (_, res) => {
    res.status(200).send("Good luck!");
  });

  app.use(routes.blogs, blogsPublicRouter);
  app.use(routes.blogs, blogsAuthRouter);

  app.use(routes.blogs, postsBlogPublicRouter);
  app.use(routes.blogs, postsBlogAuthRouter);

  app.use(routes.posts, postsPublicRouter);
  app.use(routes.posts, postsAuthRouter);

  app.use(routes.testing, clearDbRouter);
};
