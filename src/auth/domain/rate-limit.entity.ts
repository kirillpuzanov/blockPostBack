import mongoose from "mongoose";
import { RateLimitItem } from "./auth.types";

const RATE_LIMIT_COLLECTION_NAME = "rateLimit";

const RateLimitSchema = new mongoose.Schema<RateLimitItem>({
  ip: { type: String, require: true },
  url: { type: String, require: true },
  lastRequestDate: { type: Number, require: true },
});

export const RateLimitModel = mongoose.model<RateLimitItem>(
  "RateLimitModel",
  RateLimitSchema,
  RATE_LIMIT_COLLECTION_NAME,
);
