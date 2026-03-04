import request from "supertest";
import express from "express";
import { setupApp } from "../../../setup-app";
import { HTTP_STATUS } from "../../../core/const/statuses";
import { routes } from "../../../core/const/routes";
import { runDb, stopDb } from "../../../db/database";
import { SETTINGS } from "../../../core/settings/settings";
import { generateAuthHeader } from "../../../core/utils/generateAuthHeader";
import { createBlog } from "./blog-test.utils";

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

  afterAll(async () => {
    await stopDb();
  });

  it("should get all blogs + paginated meta", async () => {
    const firstBlog = await createBlog(app, newCorrectBlog);
    const secondBlog = await createBlog(app, newCorrectBlog);

    const allBlogs = await request(app)
      .get(routes.blogs)
      .query({ pageSize: 20 })
      .expect(HTTP_STATUS.ok);
    console.log(allBlogs.body);
    expect(allBlogs.body.items[0].id).toBe(secondBlog.id);
    expect(allBlogs.body.items[1].id).toBe(firstBlog.id);
    expect(allBlogs.body.pageSize).toBe(20);
    expect(allBlogs.body.page).toBe(1);
  });

  it("should create post for specific blog", async () => {
    const blog = await createBlog(app, newCorrectBlog);
    const postData = {
      title: "post4",
      shortDescription: "post by blog description",
      content: "ost by blog content",
    };
    const post = await request(app)
      .post(`${routes.blogs}/${blog.id}/posts`)
      .set(testAuthHeader)
      .send(postData)
      .expect(HTTP_STATUS.created);

    expect(post.body.blogName).toBe(blog.name);
    expect(post.body.title).toBe(postData.title);
    expect(post.body.blogId).toBe(blog.id);

    const postsByBlog = await request(app)
      .get(`${routes.blogs}/${blog.id}/posts`)
      .expect(HTTP_STATUS.ok);

    expect(postsByBlog.body.items).toHaveLength(1);
    expect(postsByBlog.body.items[0].id).toBe(post.body.id);
  });

  it("should get blog by id and update him", async () => {
    const newBlog = await createBlog(app, newCorrectBlog);
    const blogId = newBlog.id;

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

  it("should error delete if block not found", async () => {
    const newBlog = await createBlog(app, newCorrectBlog);
    const notFoundId = newBlog.id.split("").reverse().join("");

    const deleteResponse = await request(app)
      .delete(`${routes.blogs}/${notFoundId}`)
      .set(testAuthHeader)
      .expect(HTTP_STATUS.notFound);
    expect(deleteResponse.body).toEqual({
      errorsMessages: [{ field: "id", message: "blog not found" }],
    });
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
