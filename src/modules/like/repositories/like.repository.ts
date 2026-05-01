import { ClientSession } from "mongoose";

import { LikeDb, LikeStatus } from "../domain/like.types";
import { LikeModel } from "../domain/like.entity";
import { WithId } from "mongodb";

export class LikeRepository {
  async getLike(
    parentId: string,
    userId: string,
    session?: ClientSession,
  ): Promise<WithId<LikeDb> | null> {
    let query = LikeModel.findOne({ parentId, "author.userId": userId });
    if (session) {
      query = query.session(session);
    }
    return query;
  }

  async deleteLike(id: string, session?: ClientSession): Promise<void> {
    let query = LikeModel.deleteOne({ _id: id });
    if (session) {
      query = query.session(session);
    }
    await query;
  }

  async upsertLike(
    parentId: string,
    userId: string,
    userLogin: string,
    status: LikeStatus,
    session?: ClientSession,
  ): Promise<WithId<LikeDb> | null> {
    return LikeModel.findOneAndUpdate(
      { parentId, "author.userId": userId },
      {
        parentId,
        status,
        createdAt: new Date(),
        "author.userId": userId,
        "author.userLogin": userLogin,
      },
      { upsert: true, session, returnDocument: "after" },
    );
  }
}
