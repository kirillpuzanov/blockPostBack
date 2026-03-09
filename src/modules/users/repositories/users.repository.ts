import { UserDb } from "../types/user.types";
import { userCollection } from "../../../db/database";
import { ObjectId } from "mongodb";

export const usersRepository = {
  async create(user: UserDb): Promise<string> {
    const createdUser = await userCollection.insertOne(user);
    return createdUser.insertedId.toString();
  },

  async deleteOne(id: string): Promise<number> {
    const res = await userCollection.deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount;
  },

  async checkUniqueEmailOrLogin(loginOrEmail: string): Promise<boolean> {
    const user = await userCollection.findOne({
      $or: [
        { login: { $regex: loginOrEmail } },
        { email: { $regex: loginOrEmail } },
      ],
    });

    return Boolean(user?.createdAt);
  },
};
