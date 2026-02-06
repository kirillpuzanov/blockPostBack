import { Post, PostInputDTO } from "./types/post";

export const createNewPost = (input: PostInputDTO, blogName: string): Post => {
  const id = String(new Date().getTime());
  const { shortDescription, blogId, content, title } = input;

  return { id, blogId, blogName, content, shortDescription, title };
};
