import { CommentDb } from "../types/comment.types";
import { commentCollection } from "../../../db/database";
import { ObjectId } from "mongodb";

export const commentsRepository = {
  async create(comment: CommentDb): Promise<string> {
    const createdComment = await commentCollection.insertOne(comment);
    return createdComment.insertedId.toString();
  },

  async update(commentId: string, content: string): Promise<number> {
    const updatedComment = await commentCollection.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { content } },
    );
    return updatedComment.matchedCount;
  },
};
