import { Request, Response } from "express";
import { postsRepository } from "../../repositories/postsRepository";
import { HTTP_STATUS } from "../../../../core/const/statuses";

export const getPostsHandler = (_: Request, res: Response) => {
  const posts = postsRepository.getAll();
  res.status(HTTP_STATUS.ok).send(posts);
};
