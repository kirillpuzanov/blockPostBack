import { BlogDb, CreateBlogInput } from "../domain/blog.types";
import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { BlogModel } from "../domain/blog.entity";

@injectable()
export class BlogsRepository {
  async create(newBlog: BlogDb): Promise<string> {
    const createdBlog = await BlogModel.insertOne(newBlog);
    return createdBlog._id.toString();
  }

  async update(updatedBlog: CreateBlogInput, id: string): Promise<number> {
    const { name, description, websiteUrl } = updatedBlog;
    const res = await BlogModel.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, description, websiteUrl } },
    );
    return res.matchedCount;
  }

  async deleteById(id: string): Promise<number> {
    const res = await BlogModel.deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount;
  }
}
