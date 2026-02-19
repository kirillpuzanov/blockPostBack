import { postCollection } from "../../../db/database";
import { PostDb, PostInput } from "../types/post";
import { ObjectId, WithId } from "mongodb";

export const postsRepository = {
  async getAll(): Promise<WithId<PostDb>[]> {
    return postCollection.find().toArray();
  },

  async getById(id: string): Promise<WithId<PostDb> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },

  async add(newPost: PostDb): Promise<WithId<PostDb>> {
    const createdPost = await postCollection.insertOne(newPost);
    return { ...newPost, _id: createdPost.insertedId };
  },

  async update(updatedPost: PostInput, id: string): Promise<void> {
    const { title, content, blogId, shortDescription } = updatedPost;

    const res = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, content, blogId, shortDescription } },
    );

    if (res.matchedCount < 1) {
      throw new Error("Post for update not found");
    }
    return;
  },

  async deleteById(id: string): Promise<void> {
    const res = await postCollection.deleteOne({ _id: new ObjectId(id) });

    if (res.deletedCount < 1) {
      throw new Error("Post for delete not found");
    }
    return;
  },
};
