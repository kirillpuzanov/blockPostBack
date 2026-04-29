import { WithId } from "mongodb";
import { AuthSessionDb, AuthSessionViewModel } from "../domain/session.types";
import { injectable } from "inversify";
import { SessionModel } from "../domain/session.entity";

@injectable()
export class SessionsRepository {
  async getSession(deviceId: string): Promise<WithId<AuthSessionDb> | null> {
    return SessionModel.findOne({ deviceId });
  }

  async getAllActiveSessions(userId: string): Promise<AuthSessionViewModel[]> {
    const sessions = await SessionModel.find({
      userId: userId,
      exp: { $gt: Date.now() },
    }).lean();

    return sessions.map((el) => ({
      ip: el.ip,
      title: el.deviceName,
      deviceId: el.deviceId,
      lastActiveDate: new Date(el.iat).toISOString(),
    }));
  }

  async deleteOtherMySessions(userId: string, deviceId: string): Promise<void> {
    await SessionModel.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
  }

  async deleteAllUserSessions(userId: string): Promise<void> {
    /** при удалении юзера */
    await SessionModel.deleteMany({ userId: userId });
  }

  async deleteSession(userId: string, deviceId: string): Promise<number> {
    const res = await SessionModel.deleteOne({ deviceId, userId });
    return res.deletedCount;
  }

  async createSession(userSession: AuthSessionDb): Promise<void> {
    await SessionModel.insertOne(userSession);
  }

  async updateSession(
    userId: string,
    deviceId: string,
    iat: number,
    exp: number,
  ): Promise<number> {
    const res = await SessionModel.updateOne(
      { userId, deviceId },
      { $set: { iat, exp } },
    );
    return res.modifiedCount;
  }
}
