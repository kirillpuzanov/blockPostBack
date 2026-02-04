import express, { Application } from "express";
import { routes } from "./core/const/routes";
import {
  blogsAuthRouter,
  blogsPublicRouter,
} from "./entities/blogs/routers/blogs.router";
import { clearDbRouter } from "./entities/testing/clearDb.router";

export const setupApp = (app: Application) => {
  app.use(express.json());

  app.get("/", (_, res) => {
    res.status(200).send("Good luck!");
  });

  app.use(routes.blogs, blogsPublicRouter);
  app.use(routes.blogs, blogsAuthRouter);

  app.use(routes.testing, clearDbRouter);
};
