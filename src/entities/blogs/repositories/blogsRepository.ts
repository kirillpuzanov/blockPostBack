import { BlogDb, BlogInput } from "../types/blog";
import { ObjectId, WithId } from "mongodb";
import { blogCollection, postCollection } from "../../../db/database";

export const blogsRepository = {
  async getAll(): Promise<WithId<BlogDb>[]> {
    return blogCollection.find().toArray();
  },

  async getById(id: string): Promise<WithId<BlogDb> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
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
      throw new Error("blog not found");
    }
    return;
  },

  async deleteById(id: string): Promise<void> {
    const res = await blogCollection.deleteOne({ _id: new ObjectId(id) });

    if (res.deletedCount < 1) {
      throw new Error("blog not found");
    }

    /** удаляем посты привязанные к этому блогу */
    await postCollection.deleteMany({ blogId: id });
    return;
  },
};
