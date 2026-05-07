import mongoose from "mongoose";
import { PostDb } from "./post.types";

const POSTS_COLLECTION_NAME = "posts";

const PostSchema = new mongoose.Schema<PostDb>({
  title: { type: String, require: true },
  shortDescription: { type: String, require: true },
  content: { type: String, require: true },
  blogId: { type: String, require: true },
  blogName: { type: String, require: true },
  createdAt: { type: String, require: true },

  extendedLikesInfo: {
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },

    newestLikes: [{ addedAt: String, userId: String, login: String }],
  },
});

export const PostModel = mongoose.model<PostDb>(
  "PostModel",
  PostSchema,
  POSTS_COLLECTION_NAME,
);
