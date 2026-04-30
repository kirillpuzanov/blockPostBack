import mongoose from "mongoose";
import { CommentDb } from "./comment.types";

const COMMENTS_COLLECTION_NAME = "comments";

const CommentSchema = new mongoose.Schema<CommentDb>({
  blogId: { type: String, require: true },
  postId: { type: String, require: true },
  content: { type: String, require: true },
  createdAt: { type: String, require: true },

  commentatorInfo: {
    userId: { type: String, require: true },
    userLogin: { type: String, require: true },
  },
});

export const CommentModel = mongoose.model<CommentDb>(
  "CommentModel",
  CommentSchema,
  COMMENTS_COLLECTION_NAME,
);
