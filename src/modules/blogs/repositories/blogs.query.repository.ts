import { BlogDb, BlogQueryInput, BlogViewModel } from "../types/blog.types";
import { ObjectId, WithId } from "mongodb";
import { blogCollection } from "../../../db/database";
import { getPaginatedOutput } from "../../../core/utils/get-paginated-output";
import { PagedOutput } from "../../../core/types/page-and-sort";
import { NotFoundError } from "../../../core/errors/error.handler";

export const blogsQueryRepository = {
  async getAll(query: BlogQueryInput): Promise<PagedOutput<BlogViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      query;

    const skip = (pageNumber - 1) * pageSize;
    const filter: Record<string, object> = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }

    const blogs = await blogCollection
      .find(filter)
      .sort([sortBy, sortDirection])
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogCollection.countDocuments(filter);

    const blogsView = blogs.map(this._mapToBlogView);

    return getPaginatedOutput(blogsView, {
      pageNumber,
      pageSize,
      totalCount,
    });
  },

  async getById(id: string): Promise<BlogViewModel> {
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      throw new NotFoundError("blog does not exists", "blogId");
    }
    return this._mapToBlogView(blog);
  },

  _mapToBlogView(blog: WithId<BlogDb>): BlogViewModel {
    const { _id, createdAt, websiteUrl, description, name, isMembership } =
      blog;
    return {
      id: _id.toString(),
      name,
      description,
      websiteUrl,
      createdAt,
      isMembership,
    };
  },
};
