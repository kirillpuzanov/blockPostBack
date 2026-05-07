import { ObjectId, WithId } from "mongodb";
import {
  PostDb,
  PostsByBlogQueryInput,
  PostsQueryInput,
  PostViewModel,
} from "../domain/post.types";
import { getPaginatedOutput } from "../../../core/utils/get-paginated-output";
import { PagedOutput } from "../../../core/types/page-and-sort";
import { NotFoundError } from "../../../core/errors/error.handler";
import { BlogsQueryRepository } from "../../blogs/repositories/blogs.query.repository";
import { inject, injectable } from "inversify";
import { PostModel } from "../domain/post.entity";
import { LikeQueryRepository } from "../../like/repositories/like.query.repository";
import { LikeStatus, UserLikes } from "../../like/domain/like.types";

@injectable()
export class PostsQueryRepository {
  constructor(
    @inject(BlogsQueryRepository)
    public blogsQueryRepository: BlogsQueryRepository,
    @inject(LikeQueryRepository)
    public likeQueryRepository: LikeQueryRepository,
  ) {}

  async getAll(
    query: PostsQueryInput,
    userId: string | undefined,
  ): Promise<PagedOutput<PostViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;

    const skip = (pageNumber - 1) * pageSize;

    const posts = await PostModel.find()
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalCount = await PostModel.countDocuments();

    const postsIds = posts.map((el) => el._id.toString());
    const myLikes = await this.likeQueryRepository.getUserLikes(
      userId,
      postsIds,
    );

    const postsView = posts.map((el) => this._mapToPostView(el, myLikes));

    return getPaginatedOutput(postsView, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  async getById(
    id: string,
    userId: string | undefined,
  ): Promise<PostViewModel> {
    const post = await PostModel.findOne({ _id: new ObjectId(id) });

    if (!post) {
      throw new NotFoundError("post not found", "id");
    }

    const userLikes = await this.likeQueryRepository.getUserLikes(userId, [
      post._id.toString(),
    ]);

    return this._mapToPostView(post, userLikes);
  }

  async getPostsByBlog(
    blogId: string,
    query: PostsByBlogQueryInput,
    userId: string | undefined,
  ): Promise<PagedOutput<PostViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;

    const blog = await this.blogsQueryRepository.getById(blogId);

    if (!blog) {
      throw new NotFoundError("blog does not exists", "blogId");
    }

    const skip = (pageNumber - 1) * pageSize;

    const postsByBlog = await PostModel.find({ blogId })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();
    const totalCount = await PostModel.countDocuments({ blogId });

    const postsByBlogIds = postsByBlog.map((el) => el._id.toString());
    const myLikes = await this.likeQueryRepository.getUserLikes(
      userId,
      postsByBlogIds,
    );

    const postsByBlogView = postsByBlog.map((el) =>
      this._mapToPostView(el, myLikes),
    );
    return getPaginatedOutput(postsByBlogView, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  _mapToPostView(post: WithId<PostDb>, userLikes: UserLikes): PostViewModel {
    const mappedPost = {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      blogId: post.blogId,
      content: post.content,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: post.extendedLikesInfo,
    };
    return {
      ...mappedPost,
      extendedLikesInfo: {
        ...mappedPost.extendedLikesInfo,
        myStatus: userLikes[mappedPost.id] ?? LikeStatus.None,
      },
    };
  }
}
