import { BlogDb } from "../entities/blogs/types/blog";
import { Collection, MongoClient } from "mongodb";
import { SETTINGS } from "../core/settings/settings";
import { PostDb } from "../entities/posts/types/post";

const BLOGS_COLLECTION_NAME = "blogs";
const POSTS_COLLECTION_NAME = "posts";

export let client: MongoClient;
export let blogCollection: Collection<BlogDb>;
export let postCollection: Collection<PostDb>;

export const runDb = async (dbUrl: string) => {
  client = new MongoClient(dbUrl);
  const db = client.db(SETTINGS.DB_NAME);

  blogCollection = db.collection<BlogDb>(BLOGS_COLLECTION_NAME);
  postCollection = db.collection<PostDb>(POSTS_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("success connection DB");
  } catch {
    await client.close();
    throw new Error("!!  error connection DB  !!");
  }
};
