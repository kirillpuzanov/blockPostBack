import { CreatePostInput, PostDb } from "../domain/post.types";
import { NotFoundError } from "../../../core/errors/error.handler";
import { CommentService } from "../../comments/application/comments.service";
import { PostsRepository } from "../repositories/posts.repository";
import { BlogsQueryRepository } from "../../blogs/repositories/blogs.query.repository";
import { inject, injectable } from "inversify";
import { PostModel } from "../domain/post.entity";
import { LikeStatus } from "../../like/domain/like.types";
import { Result, ResultStatus } from "../../../core/types/result";
import { createResultObject } from "../../../core/utils/create-result-object";
import { LikeService } from "../../like/application/like.service";
import { LikeRepository } from "../../like/repositories/like.repository";

@injectable()
export class PostsService {
  constructor(
    @inject(BlogsQueryRepository)
    public blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsRepository)
    public postsRepository: PostsRepository,
    @inject(CommentService)
    public commentService: CommentService,
    @inject(LikeService)
    public likeService: LikeService,
    @inject(LikeRepository)
    public likeRepository: LikeRepository,
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

  async updateLikeStatus(
    userId: string,
    postId: string,
    newLikeStatus: LikeStatus,
  ): Promise<Result<null>> {
    const existingPost = await this.postsRepository.getById(postId);

    if (!existingPost) {
      return createResultObject({ status: ResultStatus.NotFound });
    }

    /** обновляем лайк / получаем дельту для изменения счетчика */
    const { status, data } = await this.likeService.updateLike(
      userId,
      postId,
      newLikeStatus,
    );

    const lastPostLikes = await this.likeRepository.getLastLikes(postId);
    const newestLikes = lastPostLikes.map((el) => ({
      addedAt: el.createdAt,
      userId: el.author.userId,
      login: el.author.userLogin,
    }));

    const updatePayload = {
      $set: { "extendedLikesInfo.newestLikes": newestLikes },
    } as Record<"$set" | "$inc", object>;

    /** добавляем к обновлению счетчик лайков поста */
    if (
      data &&
      status === ResultStatus.NoContent &&
      Object.keys(data).length > 0
    ) {
      updatePayload.$inc = {
        "extendedLikesInfo.likesCount": data.likesCount ?? 0,
        "extendedLikesInfo.dislikesCount": data.dislikesCount ?? 0,
      };
    }
    await this.postsRepository.updateLikes(postId, updatePayload);

    return createResultObject({ status: ResultStatus.NoContent });
  }
}
