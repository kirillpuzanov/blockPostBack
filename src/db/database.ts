import { BlogDb } from "../entities/blogs/types/blog";
import { Collection, MongoClient } from "mongodb";
import { SETTINGS } from "../core/settings/settings";

const BLOGS_COLLECTION_NAME = "blogs";
const POSTS_COLLECTION_NAME = "posts";
//todo any
export let client: MongoClient;
export let blogCollection: Collection<BlogDb>;
export let postCollection: Collection<any>;

export const runDb = async (dbUrl: string) => {
  client = new MongoClient(dbUrl);
  const db = client.db(SETTINGS.DB_NAME);

  blogCollection = db.collection<BlogDb>(BLOGS_COLLECTION_NAME);
  postCollection = db.collection<any>(POSTS_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("success connection DB");
  } catch {
    await client.close();
    throw new Error("!!  error connection DB  !!");
  }
};

export async function stopDb() {
  if (!client) {
    throw new Error(`No active client`);
  }
  await client.close();
}

export const database = {
  blogs: <any[]>[
    {
      id: "1",
      name: "block-1",
      description: "description for block-1",
      websiteUrl: "https://test.com",
    },
    {
      id: "2",
      name: "block-2",
      description: "description for block-2",
      websiteUrl: "https://test-2.com",
    },
  ],
  posts: <any[]>[],
};
