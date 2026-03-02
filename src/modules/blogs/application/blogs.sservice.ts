import {
  BlogDb,
  BlogInput,
  BlogQueryInput,
  PostsByBlogQueryInput,
} from "../types/blog";
import { WithId } from "mongodb";
import { blogsRepository } from "../repositories/blogsRepository";
import { NotFoundError } from "../../../core/errors/errorHandler";
import { CreatePostInput, PostDb } from "../../posts/types/post";
import { postsRepository } from "../../posts/repositories/postsRepository";

export const blogsService = {
  async getAll(
    query: BlogQueryInput,
  ): Promise<{ blogs: WithId<BlogDb>[]; totalCount: number }> {
    return blogsRepository.getAll(query);
  },

  async getById(id: string): Promise<WithId<BlogDb>> {
    const blog = await blogsRepository.getById(id);

    if (!blog) {
      throw new NotFoundError("blog not found", "id");
    }
    return blog;
  },

  async getPostsByBlog(
    blogId: string,
    query: PostsByBlogQueryInput,
  ): Promise<{ postsByBlog: WithId<PostDb>[]; totalCount: number }> {
    const blog = await blogsRepository.getById(blogId);

    if (!blog) {
      throw new NotFoundError("blog does not exists", "blogId");
    }
    return blogsRepository.getPostsByBlog(blogId, query);
  },

  async createBlog(input: BlogInput): Promise<WithId<BlogDb>> {
    const { websiteUrl, description, name } = input;
    const newBlog: BlogDb = {
      name,
      websiteUrl,
      description,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    return blogsRepository.add(newBlog);
  },

  async createPostByBlog(
    blogId: string,
    inputPost: CreatePostInput,
  ): Promise<WithId<PostDb>> {
    const blog = await blogsRepository.getById(blogId);

    if (!blog) {
      throw new NotFoundError("blog does not exists", "blogId");
    }
    const { content, shortDescription, title } = inputPost;
    const newPost: PostDb = {
      blogId,
      content,
      shortDescription,
      title,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    return postsRepository.add(newPost);
  },

  async updateBlog(updatedBlog: BlogInput, id: string): Promise<void> {
    const blog = await blogsRepository.getById(id);

    if (!blog) {
      throw new NotFoundError("blog not found", "id");
    }

    const { name, description, websiteUrl } = updatedBlog;
    await blogsRepository.update({ name, description, websiteUrl }, id);
    return;
  },

  async deleteBlog(id: string): Promise<void> {
    const blog = await blogsRepository.getById(id);

    if (!blog) {
      throw new NotFoundError("blog not found", "id");
    }
    await blogsRepository.deleteById(id);
    return;
  },
};
