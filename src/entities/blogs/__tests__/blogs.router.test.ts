import request from "supertest";
import express from "express";
import { setupApp } from "../../../setup-app";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { routes } from "../../../core/const/routes";

const testAuthHeader = {
  Authorization: "Basic YWRtaW46cXdlcnR5",
};

describe("Blogs API", () => {
  const app = express();
  setupApp(app);

  const newCorrectBlog = {
    name: "name blog",
    description: "test description",
    websiteUrl: "https://test.com",
  };

  beforeAll(async () => {
    await request(app).delete(routes.testing).expect(HTTP_STATUS.noContent);
  });

  it("should get all blogs", async () => {
    const firstBlog = await request(app)
      .post(routes.blogs)
      .set(testAuthHeader)
      .send(newCorrectBlog)
      .expect(HTTP_STATUS.created);

    const secondBlog = await request(app)
      .post(routes.blogs)
      .set(testAuthHeader)
      .send(newCorrectBlog)
      .expect(HTTP_STATUS.created);

    const allBlogs = await request(app)
      .get(routes.blogs)
      .expect(HTTP_STATUS.ok);

    expect(allBlogs.body[0].id).toBe(firstBlog.body.id);
    expect(allBlogs.body[1].id).toBe(secondBlog.body.id);
  });

  it("should get blog by id and update him", async () => {
    const newBlog = await request(app)
      .post(routes.blogs)
      .set(testAuthHeader)
      .send(newCorrectBlog)
      .expect(HTTP_STATUS.created);

    const blogId = newBlog.body.id;

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

    const updateBlog = await request(app)
      .get(`${routes.blogs}/${blogId}`)
      .send(newCorrectBlog)
      .expect(HTTP_STATUS.ok);

    expect(updateBlog.body).toEqual({ id: blogId, ...updateField });
  });

  it("should success delete blog", async () => {
    const newBlog = await request(app)
      .post(routes.blogs)
      .set(testAuthHeader)
      .send(newCorrectBlog)
      .expect(HTTP_STATUS.created);

    await request(app)
      .delete(`${routes.blogs}/${newBlog.body.id}`)
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
    const newBlog = await request(app)
      .post(routes.blogs)
      .set(testAuthHeader)
      .send(newCorrectBlog)
      .expect(HTTP_STATUS.created);

    const updated = await request(app)
      .put(`${routes.blogs}/${newBlog.body.id}`)
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
