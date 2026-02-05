import request from "supertest";
import express from "express";
import { setupApp } from "../../../setup-app";
import { createNewBlog } from "../utils";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { routes } from "../../../core/const/routes";

describe("Blogs API", () => {
  const app = express();
  setupApp(app);

  const newCorrectBlog = createNewBlog({
    name: "name blog",
    description: "test description",
    websiteUrl: "https://test.com",
  });

  beforeAll(async () => {
    await request(app).delete(routes.testing).expect(HTTP_STATUS.noContent);
  });

  // it("should get all videos", async () => {
  //   const res =
  // });
});
