import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { postsRepository } from "../../repositories/postsRepository";
import { PostDb, PostInput, PostViewModel } from "../../types/post";

import { createBaseError } from "../../../../core/utils/baseError";
import { blogsRepository } from "../../../blogs/repositories/blogsRepository";
import { mapToPostView } from "../mappers/mapToPostView";

export const createPostHandler = async (
  req: Request<{}, PostViewModel, PostInput>,
  res: Response,
) => {
  try {
    const { blogId } = req.body;
    const blog = await blogsRepository.getById(blogId);

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
    const { content, shortDescription, title } = req.body;
    const newPost: PostDb = {
      blogId,
      content,
      shortDescription,
      title,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    const createdPost = await postsRepository.add(newPost);
    const postView = mapToPostView(createdPost);

    res.status(HTTP_STATUS.created).send(postView);
  } catch {
    res.sendStatus(HTTP_STATUS.serverError);
  }
};
