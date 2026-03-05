import { postCollection } from "../../../db/database";
import { CreatePostInput, PostDb } from "../types/post.types";
import { ObjectId } from "mongodb";

export const postsRepository = {
  async create(newPost: PostDb): Promise<string> {
    const createdPost = await postCollection.insertOne(newPost);
    return createdPost.insertedId.toString();
  },

  async update(updatedPost: CreatePostInput, id: string): Promise<number> {
    const { title, content, blogId, shortDescription } = updatedPost;

    const res = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, content, blogId, shortDescription } },
    );
    return res.matchedCount;
  },

  async deleteById(id: string): Promise<number> {
    const res = await postCollection.deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount;
  },
};
