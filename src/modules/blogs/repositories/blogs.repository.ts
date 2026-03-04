import {
  BlogDb,
  BlogInput,
  BlogQueryInput,
  PostsByBlogQueryInput,
} from "../types/blog";
import { ObjectId, WithId } from "mongodb";
import { blogCollection, postCollection } from "../../../db/database";
import { PostDb } from "../../posts/types/post";
import { NotFoundError } from "../../../core/errors/error.handler";

export const blogsRepository = {
  async getAll(
    query: BlogQueryInput,
  ): Promise<{ blogs: WithId<BlogDb>[]; totalCount: number }> {
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

    return { blogs, totalCount };
  },

  async getById(id: string): Promise<WithId<BlogDb> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },

  async getPostsByBlog(
    blogId: string,
    query: PostsByBlogQueryInput,
  ): Promise<{ postsByBlog: WithId<PostDb>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;

    const skip = (pageNumber - 1) * pageSize;

    const postsByBlog = await postCollection
      .find({ blogId })
      .sort([sortBy, sortDirection])
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const totalCount = await postCollection.countDocuments({ blogId });

    return { postsByBlog, totalCount };
  },

  async add(newBlog: BlogDb): Promise<WithId<BlogDb>> {
    const createdBlog = await blogCollection.insertOne(newBlog);
    return { ...newBlog, _id: createdBlog.insertedId };
  },

  async update(updatedBlog: BlogInput, id: string): Promise<void> {
    const { name, description, websiteUrl } = updatedBlog;
    const res = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, description, websiteUrl } },
    );

    if (res.matchedCount < 1) {
      throw new NotFoundError("not found", "blog");
    }
  },

  async deleteById(id: string): Promise<void> {
    const res = await blogCollection.deleteOne({ _id: new ObjectId(id) });

    if (res.deletedCount < 1) {
      throw new NotFoundError("not found", "blog");
    }
  },
};
