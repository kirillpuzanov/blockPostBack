import { authSessionsCollection } from "../../db/database";
import { AuthSessionDb } from "../types/auth.types";
import { WithId } from "mongodb";

export const authRepository = {
  async getSession(
    userId: string,
    deviceId: string,
  ): Promise<WithId<AuthSessionDb> | null> {
    return await authSessionsCollection.findOne({ deviceId, userId });
  },

  async deleteSession(userId: string, deviceId: string): Promise<void> {
    await authSessionsCollection.deleteOne({ deviceId, userId });
  },

  async createSession(userSession: AuthSessionDb): Promise<void> {
    await authSessionsCollection.insertOne(userSession);
  },

  async updateSession(
    userId: string,
    deviceId: string,
    iat: string,
    exp: string,
  ): Promise<number> {
    const res = await authSessionsCollection.updateOne(
      { userId, deviceId },
      { $set: { iat, exp } },
    );
    return res.modifiedCount;
  },
};
