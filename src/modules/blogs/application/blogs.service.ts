import { BlogDb, CreateBlogInput } from "../types/blog.types";
import { blogsRepository } from "../repositories/blogs.repository";
import { NotFoundError } from "../../../core/errors/error.handler";
import { postsService } from "../../posts/application/posts.service";

export const blogsService = {
  async createBlog(input: CreateBlogInput): Promise<string> {
    const { websiteUrl, description, name } = input;
    const newBlog: BlogDb = {
      name,
      websiteUrl,
      description,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    return blogsRepository.create(newBlog);
  },

  async updateBlog(updatedBlog: CreateBlogInput, id: string): Promise<void> {
    const { name, description, websiteUrl } = updatedBlog;
    const updatedCount = await blogsRepository.update(
      { name, description, websiteUrl },
      id,
    );

    if (updatedCount < 1) {
      throw new NotFoundError("blog not found", "blog");
    }

    /** обновим имя блога в привязанных к нему постах */
    await postsService.updateManyPost({ blogId: id }, { blogName: name });
    return;
  },

  async deleteBlog(id: string): Promise<void> {
    const deletedCount = await blogsRepository.deleteById(id);
    if (deletedCount < 1) {
      throw new NotFoundError("blog not found", "id");
    }

    /** удаляем посты привязанные к этому блогу */
    await postsService.deleteManyPost({ blogId: id });
    return;
  },
};
