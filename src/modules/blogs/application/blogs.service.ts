import { BlogDb, CreateBlogInput } from "../types/blog.types";
import { NotFoundError } from "../../../core/errors/error.handler";
import { PostsService } from "../../posts/application/posts.service";
import { CommentService } from "../../comments/application/comments.service";
import { BlogsRepository } from "../repositories/blogs.repository";

export class BlogsService {
  constructor(
    public blogsRepository: BlogsRepository,
    public commentService: CommentService,
    public postsService: PostsService,
  ) {}

  async createBlog(input: CreateBlogInput): Promise<string> {
    const { websiteUrl, description, name } = input;
    const newBlog: BlogDb = {
      name,
      websiteUrl,
      description,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    return this.blogsRepository.create(newBlog);
  }

  async updateBlog(updatedBlog: CreateBlogInput, id: string): Promise<void> {
    const { name, description, websiteUrl } = updatedBlog;
    const updatedCount = await this.blogsRepository.update(
      { name, description, websiteUrl },
      id,
    );

    if (updatedCount < 1) {
      throw new NotFoundError("blog not found", "blog");
    }

    /** обновим имя блога в привязанных к нему постах */
    await this.postsService.updateManyPost({ blogId: id }, { blogName: name });
    return;
  }

  async deleteBlog(id: string): Promise<void> {
    const deletedCount = await this.blogsRepository.deleteById(id);
    if (deletedCount < 1) {
      throw new NotFoundError("blog not found", "id");
    }

    /** удаляем посты привязанные к этому блогу */
    await this.postsService.deleteManyPost({ blogId: id });

    /** удаляем комментарии привязанные постам блога */
    await this.commentService.deleteManyComments({ blogId: id });
    return;
  }
}
