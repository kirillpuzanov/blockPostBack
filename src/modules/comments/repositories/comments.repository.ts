import { CommentDb } from "../types/comment.types";
import { commentCollection } from "../../../db/database";

export const commentsRepository = {
  async create(comment: CommentDb): Promise<string> {
    const createdComment = await commentCollection.insertOne(comment);
    return createdComment.insertedId.toString();
  },
};
