import { BlogDb, BlogInput, BlogQueryInput } from "../types/blog";
import { ObjectId, WithId } from "mongodb";
import { blogCollection, postCollection } from "../../../db/database";
import { PostDb } from "../../posts/types/post";
import { NotFoundError } from "../../../core/errors/errorHandler";

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

  async getPostsByBlog(blogId: string): Promise<WithId<PostDb>[]> {
    return postCollection.find({ blogId }).toArray();
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

    /** обновим имя блога в привязанных к нему постах */
    await postCollection.updateMany(
      { blogId: id },
      { $set: { blogName: name } },
    );
    return;
  },

  async deleteById(id: string): Promise<void> {
    const res = await blogCollection.deleteOne({ _id: new ObjectId(id) });

    if (res.deletedCount < 1) {
      throw new NotFoundError("not found", "blog");
    }

    /** удаляем посты привязанные к этому блогу */
    await postCollection.deleteMany({ blogId: id });
    return;
  },
};
