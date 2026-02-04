import { Blog } from "../types/blog.type";
import { database } from "../../../db/database";

export const blogsRepository = {
  getAll(): Blog[] {
    return database.blogs ?? [];
  },

  getBlog(id: string): Blog | null {
    const res = database.blogs.find((el: Blog) => el.id === id);
    return res || null;
  },
};
