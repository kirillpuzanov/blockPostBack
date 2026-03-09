import { UserDb } from "../types/user.types";
import { userCollection } from "../../../db/database";

export const usersRepository = {
  async create(user: UserDb): Promise<string> {
    const createdUser = await userCollection.insertOne(user);
    return createdUser.insertedId.toString();
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
