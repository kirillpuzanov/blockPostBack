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

@injectable()
export class PostsQueryRepository {
  constructor(
    @inject(BlogsQueryRepository)
    public blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async getAll(query: PostsQueryInput): Promise<PagedOutput<PostViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;

    const skip = (pageNumber - 1) * pageSize;

    const posts = await PostModel.find()
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalCount = await PostModel.countDocuments();
    const postsView = posts.map(this._mapToPostView);

    return getPaginatedOutput(postsView, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  async getById(id: string): Promise<PostViewModel> {
    const post = await PostModel.findOne({ _id: new ObjectId(id) });

    if (!post) {
      throw new NotFoundError("post not found", "id");
    }
    return this._mapToPostView(post);
  }

  async getPostsByBlog(
    blogId: string,
    query: PostsByBlogQueryInput,
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

    const postsByBlogView = postsByBlog.map(this._mapToPostView);
    return getPaginatedOutput(postsByBlogView, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  _mapToPostView(post: WithId<PostDb>): PostViewModel {
    const {
      title,
      shortDescription,
      blogId,
      content,
      blogName,
      createdAt,
      _id,
    } = post;
    return {
      id: _id.toString(),
      title,
      shortDescription,
      blogId,
      content,
      blogName,
      createdAt,
    };
  }
}
