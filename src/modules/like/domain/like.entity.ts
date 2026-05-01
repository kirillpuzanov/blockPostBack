import mongoose from "mongoose";
import { LikeDb } from "./like.types";

const LIKES_COLLECTION_NAME = "likes";

const LikeSchema = new mongoose.Schema<LikeDb>({
  parentId: { type: String, require: true },
  createdAt: { type: Date, require: true },
  status: { type: String, require: true },

  author: {
    userId: { type: String, require: true },
    userLogin: { type: String, require: true },
  },
});

export const LikeModel = mongoose.model<LikeDb>(
  "LikeModel",
  LikeSchema,
  LIKES_COLLECTION_NAME,
);
