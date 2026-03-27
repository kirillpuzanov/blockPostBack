import { blackListCollection } from "../../db/database";
import { BlackListToken } from "../types/auth.types";

export const authRepository = {
  async isExistInBlackList(token: string): Promise<boolean> {
    const res = await blackListCollection.findOne({ token });
    return Boolean(res?.token);
  },

  async addToBlackList(blackToken: BlackListToken): Promise<string> {
    const res = await blackListCollection.insertOne(blackToken);
    return res.insertedId.toString();
  },
};
