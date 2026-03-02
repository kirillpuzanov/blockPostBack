import { postCollection } from "../../../db/database";
import { PostDb, PostInput, PostsQueryInput } from "../types/post";
import { ObjectId, WithId } from "mongodb";
import { NotFoundError } from "../../../core/errors/errorHandler";

export const postsRepository = {
  async getAll(
    query: PostsQueryInput,
  ): Promise<{ posts: WithId<PostDb>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;

    const skip = (pageNumber - 1) * pageSize;

    const posts = await postCollection
      .find()
      .sort([sortBy, sortDirection])
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postCollection.countDocuments();
    return { posts, totalCount };
  },

  async getById(id: string): Promise<WithId<PostDb> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newPost: PostDb): Promise<WithId<PostDb>> {
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
      throw new NotFoundError("not found for update", "post");
    }
    return;
  },

  async deleteById(id: string): Promise<void> {
    const res = await postCollection.deleteOne({ _id: new ObjectId(id) });

    if (res.deletedCount < 1) {
      throw new NotFoundError("not found for delete", "post");
    }
    return;
  },
};
