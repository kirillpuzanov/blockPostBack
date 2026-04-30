import { Collection, MongoClient } from "mongodb";
import { SETTINGS } from "../core/settings/settings";
import { RateLimitItem } from "../auth/types/auth.types";
import mongoose from "mongoose";
import { SessionModel } from "../modules/sessions/domain/session.entity";
import { UserModel } from "../modules/users/domain/user.entity";
import { PostModel } from "../modules/posts/domain/post.entity";
import { CommentModel } from "../modules/comments/domain/comment.entity";
import { BlogModel } from "../modules/blogs/domain/blog.entity";

const RATE_LIMIT_COLLECTION_NAME = "rateLimit";

export let client: MongoClient;

export let rateLimitCollection: Collection<RateLimitItem>;

export const runDb = async (dbUrl: string) => {
  client = new MongoClient(dbUrl);
  const db = client.db(SETTINGS.DB_NAME);

  rateLimitCollection = db.collection<RateLimitItem>(
    RATE_LIMIT_COLLECTION_NAME,
  );

  try {
    await mongoose.connect(dbUrl, {
      dbName: SETTINGS.DB_NAME,
    });

    await client.connect();
    await db.command({ ping: 1 });
    console.log("success connection DB");
  } catch {
    await mongoose.disconnect();
    await client.close();
    throw new Error("!!  error connection DB  !!");
  }
};

export const stopDb = async () => {
  await mongoose.disconnect();
  await client.close();
};

export const clearDB = async () => {
  try {
    await Promise.all([
      BlogModel.deleteMany(),
      PostModel.deleteMany(),
      UserModel.deleteMany(),
      CommentModel.deleteMany(),
      SessionModel.deleteMany(),
      rateLimitCollection.deleteMany(),
    ]);
  } catch {
    console.log("!!! error clear test DB !!");
  }
};
