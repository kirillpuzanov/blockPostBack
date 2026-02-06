import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { postsRepository } from "../../repositories/postsRepository";
import { createBaseError } from "../../../../core/utils/baseError";
import { Post, PostInputDTO } from "../../types/post";

export const updatePostHandler = (
  req: Request<{ id: string }, Post, PostInputDTO>,
  res: Response,
) => {
  const id = req.params.id;
  const post = postsRepository.getById(id);

  if (!post) {
    res
      .status(HTTP_STATUS.notFound)
      .send(createBaseError([{ field: "id", message: "post not found" }]));
    return;
  }

  const { title, blogId, content, shortDescription } = req.body;

  const updatedBlog: Post = {
    title,
    blogId,
    content,
    shortDescription,
    id: post.id,
    blogName: post.blogName,
  };
  postsRepository.update(updatedBlog);

  res.sendStatus(HTTP_STATUS.noContent);
  return;
};
