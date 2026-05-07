import { CreatePostInput, PostDb } from "../domain/post.types";
import { ObjectId } from "mongodb";
import { NotFoundError } from "../../../core/errors/error.handler";
import { injectable } from "inversify";
import { PostModel } from "../domain/post.entity";

@injectable()
export class PostsRepository {
  async create(newPost: PostDb): Promise<string> {
    const createdPost = await PostModel.insertOne(newPost);
    return createdPost._id.toString();
  }

  async update(updatedPost: CreatePostInput, id: string): Promise<number> {
    const { title, content, blogId, shortDescription } = updatedPost;

    const res = await PostModel.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, content, blogId, shortDescription } },
    );
    return res.matchedCount;
  }

  async deleteById(id: string): Promise<number> {
    const res = await PostModel.deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount;
  }

  async getById(id: string): Promise<PostDb> {
    const post = await PostModel.findOne({ _id: new ObjectId(id) });

    if (!post) {
      throw new NotFoundError("post not found", "id");
    }
    return post;
  }
}
