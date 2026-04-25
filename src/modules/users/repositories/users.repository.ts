import { UserDb, UserViewModel } from "../types/user.types";
import { userCollection } from "../../../db/database";
import { ObjectId, WithId } from "mongodb";

export const usersRepository = {
  async create(user: UserDb): Promise<string> {
    const createdUser = await userCollection.insertOne(user);
    return createdUser.insertedId.toString();
  },

  async deleteOne(id: string): Promise<number> {
    const res = await userCollection.deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount;
  },

  async update(_id: ObjectId, data: object): Promise<number> {
    const result = await userCollection.updateOne({ _id }, { $set: data });
    return result.modifiedCount;
  },

  async checkUniqueEmailOrLogin(loginOrEmail: string): Promise<boolean> {
    const user = await userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    return Boolean(user?.createdAt);
  },

  async getByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<WithId<UserDb> | null> {
    return userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  },

  async getByConfirmCode(confirmCode: string): Promise<WithId<UserDb> | null> {
    return userCollection.findOne({
      "emailConfirmation.confirmationCode": confirmCode,
    });
  },

  async getByRecoveryPassCode(
    confirmCode: string,
  ): Promise<WithId<UserDb> | null> {
    return userCollection.findOne({
      "recoveryPassData.recoveryPassCode": confirmCode,
    });
  },

  async getById(id: string): Promise<UserViewModel | null> {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return null;
    }
    return {
      id: user._id.toString(),
      email: user.email,
      login: user.login,
      createdAt: user.createdAt,
    };
  },
};
