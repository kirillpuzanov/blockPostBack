import request from "supertest";
import express from "express";
import { setupApp } from "../../../setup-app";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { routes } from "../../../core/const/routes";
import { runDb } from "../../../db/database";
import { SETTINGS } from "../../../core/settings/settings";
import { generateAuthHeader } from "../../../core/utils/generateAuthHeader";
import { createBlog } from "./blogTestUtils";

const testAuthHeader = generateAuthHeader();

describe("Blogs API", () => {
  const app = express();
  setupApp(app);

  const newCorrectBlog = {
    name: "name blog",
    description: "test description",
    websiteUrl: "https://test.com",
  };

  beforeAll(async () => {
    await runDb(SETTINGS.MONGO_URL);
    await request(app).delete(routes.testing).expect(HTTP_STATUS.noContent);
  });

  it("should get all blogs", async () => {
    const firstBlog = await createBlog(app, newCorrectBlog);
    const secondBlog = await createBlog(app, newCorrectBlog);

    const allBlogs = await request(app)
      .get(routes.blogs)
      .expect(HTTP_STATUS.ok);

    expect(allBlogs.body[0].id).toBe(firstBlog.id);
    expect(allBlogs.body[1].id).toBe(secondBlog.id);
  });

  it("should get blog by id and update him", async () => {
    const newBlog = await createBlog(app, newCorrectBlog);
    const blogId = newBlog.id;

    await request(app)
      .get(`${routes.blogs}/${blogId}`)
      .send(newCorrectBlog)
      .expect(HTTP_STATUS.ok);

    const updateField = {
      name: "updated",
      description: "updated description",
      websiteUrl: "https://test.com",
    };

    await request(app)
      .put(`${routes.blogs}/${blogId}`)
      .set(testAuthHeader)
      .send(updateField)
      .expect(HTTP_STATUS.noContent);

    const updatedBlog = await request(app)
      .get(`${routes.blogs}/${blogId}`)
      .send(newCorrectBlog)
      .expect(HTTP_STATUS.ok);

    expect(updatedBlog.body).toEqual({
      id: blogId,
      createdAt: newBlog.createdAt,
      isMembership: newBlog.isMembership,
      ...updateField,
    });
  });

  it("should success delete blog", async () => {
    const newBlog = await createBlog(app, newCorrectBlog);

    await request(app)
      .delete(`${routes.blogs}/${newBlog.id}`)
      .set(testAuthHeader)
      .expect(HTTP_STATUS.noContent);
  });

  it("should not create if not validField body", async () => {
    const newBlog = await request(app)
      .post(routes.blogs)
      .set(testAuthHeader)
      .send({
        name: "  ",
        description: "",
        websiteUrl: "http://test.com",
      })
      .expect(HTTP_STATUS.badRequest);
    expect(newBlog.body.errorsMessages).toHaveLength(3);
  });

  it("should not update if not validField body", async () => {
    const newBlog = await createBlog(app, newCorrectBlog);

    const updated = await request(app)
      .put(`${routes.blogs}/${newBlog.id}`)
      .set(testAuthHeader)
      .send({
        ...newCorrectBlog,
        websiteUrl: "www",
      })
      .expect(HTTP_STATUS.badRequest);

    expect(updated.body.errorsMessages).toHaveLength(1);
  });

  it("should return unauthorized for other user by auth routes", async () => {
    const firstBlog = await request(app)
      .post(routes.blogs)
      .send(newCorrectBlog)
      .expect(HTTP_STATUS.unAuthorized);

    await request(app)
      .put(`${routes.blogs}/${firstBlog.body.id}`)
      .send({})
      .expect(HTTP_STATUS.unAuthorized);

    await request(app)
      .delete(`${routes.blogs}/${firstBlog.body.id}`)
      .expect(HTTP_STATUS.unAuthorized);
  });
});
