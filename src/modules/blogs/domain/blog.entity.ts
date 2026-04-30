import mongoose from "mongoose";
import { BlogDb } from "./blog.types";

const BLOGS_COLLECTION_NAME = "blogs";

const BlogSchema = new mongoose.Schema<BlogDb>({
  name: { type: String, require: true },
  description: { type: String, require: true },
  websiteUrl: { type: String, require: true },
  createdAt: { type: String, require: true },
  isMembership: { type: Boolean, require: true },
});

export const BlogModel = mongoose.model<BlogDb>(
  "BlogModel",
  BlogSchema,
  BLOGS_COLLECTION_NAME,
);
