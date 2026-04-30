import { SETTINGS } from "../core/settings/settings";
import mongoose from "mongoose";
import { SessionModel } from "../modules/sessions/domain/session.entity";
import { UserModel } from "../modules/users/domain/user.entity";
import { PostModel } from "../modules/posts/domain/post.entity";
import { CommentModel } from "../modules/comments/domain/comment.entity";
import { BlogModel } from "../modules/blogs/domain/blog.entity";
import { RateLimitModel } from "../auth/domain/rate-limit.entity";

export const runDb = async (dbUrl: string) => {
  try {
    await mongoose.connect(dbUrl, {
      dbName: SETTINGS.DB_NAME,
    });
    console.log("success connection DB");
  } catch {
    await mongoose.disconnect();
    throw new Error("!!  error connection DB  !!");
  }
};

export const stopDb = async () => {
  await mongoose.disconnect();
};

export const clearDB = async () => {
  try {
    await Promise.all([
      BlogModel.deleteMany(),
      PostModel.deleteMany(),
      UserModel.deleteMany(),
      CommentModel.deleteMany(),
      SessionModel.deleteMany(),
      RateLimitModel.deleteMany(),
    ]);
  } catch {
    console.log("!!! error clear test DB !!");
  }
};
