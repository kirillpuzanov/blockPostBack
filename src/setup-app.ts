import express, { Application } from "express";
// import { videoRouter } from "./video/router/video.router";
// import { deleteDbRouter } from "./deleteDb/delete.router";
// import { routes } from "./core/const/routes";

export const setupApp = (app: Application) => {
  app.use(express.json());

  app.get("/", (_, res) => {
    res.status(200).send("Good luck!");
  });

  // app.use(routes.videos, videoRouter);
  // app.use(routes.testing, deleteDbRouter);
};
