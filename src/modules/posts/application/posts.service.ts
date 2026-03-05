import { CreatePostInput, PostDb } from "../types/post.types";
import { postsRepository } from "../repositories/posts.repository";
import { NotFoundError } from "../../../core/errors/error.handler";
import { postCollection } from "../../../db/database";
import { blogsQueryRepository } from "../../blogs/repositories/blogs.query.repository";

export const postsService = {
  async createPost(input: CreatePostInput): Promise<string> {
    const { blogId } = input;
    const blog = await blogsQueryRepository.getById(blogId);

    if (!blog) {
      throw new NotFoundError("blog not found", "blogId");
    }
    const { content, shortDescription, title } = input;
    const newPost: PostDb = {
      blogId,
      content,
      shortDescription,
      title,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    return postsRepository.create(newPost);
  },

  async updatePost(updatedPost: CreatePostInput, id: string): Promise<void> {
    const { title, blogId, content, shortDescription } = updatedPost;

    const updatedCount = await postsRepository.update(
      { title, blogId, content, shortDescription },
      id,
    );

    if (updatedCount < 1) {
      throw new NotFoundError("not found for update", "post");
    }
    return;
  },

  async deletePost(id: string): Promise<void> {
    const deletedCount = await postsRepository.deleteById(id);

    if (deletedCount < 1) {
      throw new NotFoundError("not found for delete", "post");
    }
    return;
  },

  async deleteManyPost(filter: Record<string, string>): Promise<void> {
    await postCollection.deleteMany(filter);
    return;
  },

  async updateManyPost(
    filter: Record<string, string>,
    data: Record<string, string>,
  ): Promise<void> {
    await postCollection.updateMany(filter, { $set: data });
    return;
  },
};
