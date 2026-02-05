import { Blog, BlogInputDTO } from "./types/blog.type";

export const createNewBlog = (inputBlog: BlogInputDTO): Blog => {
  const id = String(new Date().getTime());

  const { websiteUrl, description, name } = inputBlog;

  return {
    id,
    websiteUrl,
    description,
    name,
  };
};
