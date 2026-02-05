import { Blog } from "../types/blog.type";
import { database } from "../../../db/database";

export const blogsRepository = {
  getAll(): Blog[] {
    return database.blogs ?? [];
  },

  getById(id: string): Blog | null {
    const res = database.blogs.find((el: Blog) => el.id === id);
    return res || null;
  },

  add(newBlog: Blog) {
    database.blogs.push(newBlog);
    return newBlog;
  },

  update(updatedBlog: Blog) {
    const idx = database.blogs.findIndex((el) => el.id === updatedBlog.id);

    if (idx === -1) {
      throw new Error("blog for update not found");
    }
    database.blogs[idx] = updatedBlog;
    return;
  },
};
