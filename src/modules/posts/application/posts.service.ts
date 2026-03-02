import { WithId } from "mongodb";
import { PostDb, PostInput, PostsQueryInput } from "../types/post";
import { postsRepository } from "../repositories/postsRepository";
import { NotFoundError } from "../../../core/errors/errorHandler";
import { blogsRepository } from "../../blogs/repositories/blogsRepository";
import { postCollection } from "../../../db/database";

export const postsService = {
  async getAll(
    query: PostsQueryInput,
  ): Promise<{ posts: WithId<PostDb>[]; totalCount: number }> {
    return postsRepository.getAll(query);
  },

  async getById(id: string): Promise<WithId<PostDb>> {
    const post = await postsRepository.getById(id);

    if (!post) {
      throw new NotFoundError("post not found", "id");
    }
    return post;
  },

  async createPost(input: PostInput): Promise<WithId<PostDb>> {
    const { blogId } = input;
    const blog = await blogsRepository.getById(blogId);

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

  async updatePost(updatedPost: PostInput, id: string): Promise<void> {
    const post = await postsRepository.getById(id);

    if (!post) {
      throw new NotFoundError("post not found", "id");
    }

    const { title, blogId, content, shortDescription } = updatedPost;

    return postsRepository.update(
      { title, blogId, content, shortDescription },
      id,
    );
  },

  async deletePost(id: string): Promise<void> {
    const post = await postsRepository.getById(id);

    if (!post) {
      throw new NotFoundError("post not found", "id");
    }
    return postsRepository.deleteById(id);
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
