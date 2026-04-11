import { WithId } from "mongodb";
import { AuthSessionDb, AuthSessionViewModel } from "../types/session.types";
import { authSessionsCollection } from "../../../db/database";

export const sessionsRepository = {
  async getSession(deviceId: string): Promise<WithId<AuthSessionDb> | null> {
    return await authSessionsCollection.findOne({ deviceId });
  },

  async getAllActiveSessions(userId: string): Promise<AuthSessionViewModel[]> {
    const sessions = await authSessionsCollection
      .find({
        userId: userId,
        exp: { $gt: Date.now() },
      })
      .toArray();

    return sessions.map((el) => ({
      ip: el.ip,
      title: el.deviceName,
      deviceId: el.deviceId,
      lastActiveDate: new Date(el.iat).toISOString(),
    }));
  },

  async deleteOtherMySessions(userId: string, deviceId: string): Promise<void> {
    await authSessionsCollection.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
  },

  async deleteAllUserSessions(userId: string): Promise<void> {
    /** при удалении юзера */
    await authSessionsCollection.deleteMany({ userId: userId });
  },

  async deleteSession(userId: string, deviceId: string): Promise<number> {
    const res = await authSessionsCollection.deleteOne({ deviceId, userId });
    return res.deletedCount;
  },

  async createSession(userSession: AuthSessionDb): Promise<void> {
    await authSessionsCollection.insertOne(userSession);
  },

  async updateSession(
    userId: string,
    deviceId: string,
    iat: number,
    exp: number,
  ): Promise<number> {
    const res = await authSessionsCollection.updateOne(
      { userId, deviceId },
      { $set: { iat, exp } },
    );
    return res.modifiedCount;
  },
};
