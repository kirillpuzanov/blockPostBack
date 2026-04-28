import { BlogDb, CreateBlogInput } from "../types/blog.types";
import { ObjectId } from "mongodb";
import { blogCollection } from "../../../db/database";
import { injectable } from "inversify";

@injectable()
export class BlogsRepository {
  async create(newBlog: BlogDb): Promise<string> {
    const createdBlog = await blogCollection.insertOne(newBlog);
    return createdBlog.insertedId.toString();
  }

  async update(updatedBlog: CreateBlogInput, id: string): Promise<number> {
    const { name, description, websiteUrl } = updatedBlog;
    const res = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, description, websiteUrl } },
    );
    return res.matchedCount;
  }

  async deleteById(id: string): Promise<number> {
    const res = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount;
  }
}
