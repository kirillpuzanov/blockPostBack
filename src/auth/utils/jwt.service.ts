import jwt from "jsonwebtoken";
import { SETTINGS } from "../../core/settings/settings";
import { StringValue } from "ms";

export const jwtService = {
  async createToken(userId: string, expTime: StringValue = "30 days") {
    return jwt.sign({ userId }, SETTINGS.JWT_SECRET, { expiresIn: expTime });
  },

  async createTokens(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = await this.createToken(userId, "10 Sec");
    const refreshToken = await this.createToken(userId, "20 Sec");

    return { accessToken, refreshToken };
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
