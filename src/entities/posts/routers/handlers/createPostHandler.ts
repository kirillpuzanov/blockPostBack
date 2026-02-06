import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { postsRepository } from "../../repositories/postsRepository";
import { Post, PostInputDTO } from "../../types/post";
import { createNewPost } from "../../utils";
import { database } from "../../../../db/database";
import { Blog } from "../../../blogs/types/blog";
import { createBaseError } from "../../../../core/utils/baseError";

export const createPostHandler = (
  req: Request<{}, Post, PostInputDTO>,
  res: Response,
) => {
  const { blogId } = req.body;
  const blog = database.blogs.find((el: Blog) => el.id === blogId);

  if (!blog) {
    res.status(HTTP_STATUS.badRequest).send(
      createBaseError([
        {
          field: "blogId",
          message: "blog not found",
        },
      ]),
    );
    return;
  }

  const newPost = createNewPost(req.body, blog.name);
  postsRepository.add(newPost);

  res.status(HTTP_STATUS.created).send(newPost);
};
