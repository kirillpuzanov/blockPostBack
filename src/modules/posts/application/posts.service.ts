import { CreatePostInput, PostDb } from "../domain/post.types";
import { NotFoundError } from "../../../core/errors/error.handler";
import { CommentService } from "../../comments/application/comments.service";
import { PostsRepository } from "../repositories/posts.repository";
import { BlogsQueryRepository } from "../../blogs/repositories/blogs.query.repository";
import { inject, injectable } from "inversify";
import { PostModel } from "../domain/post.entity";

@injectable()
export class PostsService {
  constructor(
    @inject(BlogsQueryRepository)
    public blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsRepository)
    public postsRepository: PostsRepository,
    @inject(CommentService)
    public commentService: CommentService,
  ) {}

  async createPost(input: CreatePostInput): Promise<string> {
    const { blogId } = input;
    const blog = await this.blogsQueryRepository.getById(blogId);

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
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        newestLikes: [],
      },
    };
    return this.postsRepository.create(newPost);
  }

  async updatePost(updatedPost: CreatePostInput, id: string): Promise<void> {
    const { title, blogId, content, shortDescription } = updatedPost;

    const updatedCount = await this.postsRepository.update(
      { title, blogId, content, shortDescription },
      id,
    );

    if (updatedCount < 1) {
      throw new NotFoundError("not found for update", "post");
    }
    return;
  }

  async deletePost(id: string): Promise<void> {
    const deletedCount = await this.postsRepository.deleteById(id);

    if (deletedCount < 1) {
      throw new NotFoundError("not found for delete", "post");
    }

    /** удаляем комментарии привязанные к этому посту */
    await this.commentService.deleteManyComments({ postId: id });
    return;
  }

  async deleteManyPost(filter: Record<string, string>): Promise<void> {
    await PostModel.deleteMany(filter);
    return;
  }

  async updateManyPost(
    filter: Record<string, string>,
    data: Record<string, string>,
  ): Promise<void> {
    await PostModel.updateMany(filter, { $set: data });
    return;
  }
}
