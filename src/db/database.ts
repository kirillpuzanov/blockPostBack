import { BlogDb } from "../modules/blogs/types/blog.types";
import { Collection, MongoClient } from "mongodb";
import { SETTINGS } from "../core/settings/settings";
import { PostDb } from "../modules/posts/types/post.types";
import { UserDb } from "../modules/users/types/user.types";
import { CommentDb } from "../modules/comments/types/comment.types";
import { RateLimitItem } from "../auth/types/auth.types";
import mongoose from "mongoose";
import { SessionModel } from "../modules/sessions/domain/session.entity";

const BLOGS_COLLECTION_NAME = "blogs";
const POSTS_COLLECTION_NAME = "posts";
const USERS_COLLECTION_NAME = "users";
const COMMENTS_COLLECTION_NAME = "comments";

const RATE_LIMIT_COLLECTION_NAME = "rateLimit";

export let client: MongoClient;
export let blogCollection: Collection<BlogDb>;
export let postCollection: Collection<PostDb>;
export let userCollection: Collection<UserDb>;
export let commentCollection: Collection<CommentDb>;
export let rateLimitCollection: Collection<RateLimitItem>;

export const runDb = async (dbUrl: string) => {
  client = new MongoClient(dbUrl);
  const db = client.db(SETTINGS.DB_NAME);

  blogCollection = db.collection<BlogDb>(BLOGS_COLLECTION_NAME);
  postCollection = db.collection<PostDb>(POSTS_COLLECTION_NAME);
  userCollection = db.collection<UserDb>(USERS_COLLECTION_NAME);
  commentCollection = db.collection<CommentDb>(COMMENTS_COLLECTION_NAME);
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

export const testClearDB = async () => {
  try {
    await Promise.all([
      blogCollection.deleteMany(),
      postCollection.deleteMany(),
      userCollection.deleteMany(),
      commentCollection.deleteMany(),
      SessionModel.deleteMany(),
      rateLimitCollection.deleteMany(),
    ]);
  } catch {
    console.log("!!! error clear test DB !!");
  }
};
