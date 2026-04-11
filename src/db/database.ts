import { BlogDb } from "../modules/blogs/types/blog.types";
import { Collection, MongoClient } from "mongodb";
import { SETTINGS } from "../core/settings/settings";
import { PostDb } from "../modules/posts/types/post.types";
import { UserDb } from "../modules/users/types/user.types";
import { CommentDb } from "../modules/comments/types/comment.types";
import { AuthSessionDb } from "../modules/sessions/types/session.types";

const BLOGS_COLLECTION_NAME = "blogs";
const POSTS_COLLECTION_NAME = "posts";
const USERS_COLLECTION_NAME = "users";
const COMMENTS_COLLECTION_NAME = "comments";
const SESSIONS_COLLECTION_NAME = "authDeviceSessions";

export let client: MongoClient;
export let blogCollection: Collection<BlogDb>;
export let postCollection: Collection<PostDb>;
export let userCollection: Collection<UserDb>;
export let commentCollection: Collection<CommentDb>;
export let authSessionsCollection: Collection<AuthSessionDb>;

export const runDb = async (dbUrl: string) => {
  client = new MongoClient(dbUrl);
  const db = client.db(SETTINGS.DB_NAME);

  blogCollection = db.collection<BlogDb>(BLOGS_COLLECTION_NAME);
  postCollection = db.collection<PostDb>(POSTS_COLLECTION_NAME);
  userCollection = db.collection<UserDb>(USERS_COLLECTION_NAME);
  commentCollection = db.collection<CommentDb>(COMMENTS_COLLECTION_NAME);
  authSessionsCollection = db.collection<AuthSessionDb>(
    SESSIONS_COLLECTION_NAME,
  );

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("success connection DB");
  } catch {
    await client.close();
    throw new Error("!!  error connection DB  !!");
  }
};

export const stopDb = async () => {
  await client.close();
};

export const testClearDB = async () => {
  try {
    await Promise.all([
      blogCollection.deleteMany(),
      postCollection.deleteMany(),
      userCollection.deleteMany(),
      commentCollection.deleteMany(),
      authSessionsCollection.deleteMany(),
    ]);
  } catch {
    console.log("!!! error clear test DB !!");
  }
};
