import { postCollection } from "../../../db/database";
import { CreatePostInput, PostDb, PostViewModel } from "../types/post.types";
import { ObjectId } from "mongodb";
import { NotFoundError } from "../../../core/errors/error.handler";

export class PostsRepository {
  async create(newPost: PostDb): Promise<string> {
    const createdPost = await postCollection.insertOne(newPost);
    return createdPost.insertedId.toString();
  }

  async update(updatedPost: CreatePostInput, id: string): Promise<number> {
    const { title, content, blogId, shortDescription } = updatedPost;

    const res = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, content, blogId, shortDescription } },
    );
    return res.matchedCount;
  }

  async deleteById(id: string): Promise<number> {
    const res = await postCollection.deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount;
  }

  async getById(id: string): Promise<PostViewModel> {
    const post = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      throw new NotFoundError("post not found", "id");
    }
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      blogId: post.blogId,
      content: post.content,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  }
}
