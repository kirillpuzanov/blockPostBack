import jwt from "jsonwebtoken";
import { SETTINGS } from "../../core/settings/settings";

export const jwtService = {
  async createToken(userId: string) {
    return jwt.sign({ userId }, SETTINGS.JWT_SECRET, { expiresIn: "30 days" });
  },

  async verifyToken(token: string): Promise<string | null> {
    try {
      const verify = jwt.verify(token, SETTINGS.JWT_SECRET) as {
        userId: string;
      };
      return verify.userId ?? null;
    } catch {
      return null;
    }
  },
};
