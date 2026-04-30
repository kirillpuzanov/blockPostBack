import { UserDb, UserViewModel } from "../domain/user.types";
import { ObjectId, WithId } from "mongodb";
import { injectable } from "inversify";
import { UserModel } from "../domain/user.entity";

@injectable()
export class UsersRepository {
  async create(user: UserDb): Promise<string> {
    const createdUser = await UserModel.insertOne(user);
    return createdUser._id.toString();
  }

  async deleteOne(id: string): Promise<number> {
    const res = await UserModel.deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount;
  }

  async update(_id: ObjectId, data: object): Promise<number> {
    const result = await UserModel.updateOne({ _id }, { $set: data });
    return result.modifiedCount;
  }

  async checkUniqueEmailOrLogin(loginOrEmail: string): Promise<boolean> {
    const user = await UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    return Boolean(user?.createdAt);
  }

  async getByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<WithId<UserDb> | null> {
    return UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  async getByConfirmCode(confirmCode: string): Promise<WithId<UserDb> | null> {
    return UserModel.findOne({
      "emailConfirmation.confirmationCode": confirmCode,
    });
  }

  async getByRecoveryPassCode(
    confirmCode: string,
  ): Promise<WithId<UserDb> | null> {
    return UserModel.findOne({
      "recoveryPassData.recoveryPassCode": confirmCode,
    });
  }

  async getById(id: string): Promise<UserViewModel | null> {
    const user = await UserModel.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return null;
    }
    return {
      id: user._id.toString(),
      email: user.email,
      login: user.login,
      createdAt: user.createdAt,
    };
  }
}
