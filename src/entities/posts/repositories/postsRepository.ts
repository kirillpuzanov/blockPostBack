import { database } from "../../../db/database";
import { Post } from "../types/post";

export const postsRepository = {
  getAll(): Post[] {
    return database.posts ?? [];
  },

  getById(id: string): Post | null {
    const res = database.posts.find((el: Post) => el.id === id);
    return res || null;
  },

  add(newPost: Post) {
    database.posts.push(newPost);
    return newPost;
  },

  update(updatedPost: Post) {
    const idx = database.posts.findIndex((el) => el.id === updatedPost.id);

    if (idx === -1) {
      throw new Error("Post for update not found");
    }
    database.posts[idx] = updatedPost;
    return;
  },

  deleteById(id: string) {
    const idx = database.posts.findIndex((el) => el.id === id);

    if (idx === -1) {
      throw new Error("Post for delete not found");
    }
    database.posts.splice(idx, 1);
    return;
  },
};
