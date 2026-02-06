import { Blog } from "../types/blog";
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

  deleteById(id: string) {
    const idx = database.blogs.findIndex((el) => el.id === id);

    if (idx === -1) {
      throw new Error("blog for delete not found");
    }
    database.blogs.splice(idx, 1);

    /** удаляем посты привязанные к этому блогу */
    const filteredPosts = database.posts.filter((el) => el.blogId !== id);
    database.posts = filteredPosts;
    return;
  },
};
