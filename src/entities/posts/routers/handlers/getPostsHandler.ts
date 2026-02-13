import { Request, Response } from "express";
import { postsRepository } from "../../repositories/postsRepository";
import { HTTP_STATUS } from "../../../../core/const/statuses";
import { mapToPostView } from "../mappers/mapToPostView";

export const getPostsHandler = async (_: Request, res: Response) => {
  try {
    const posts = await postsRepository.getAll();
    const postsView = posts.map((el) => mapToPostView(el));
    res.status(HTTP_STATUS.ok).send(postsView);
  } catch {
    res.sendStatus(HTTP_STATUS.serverError);
  }
};
