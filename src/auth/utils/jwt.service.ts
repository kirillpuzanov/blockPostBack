import jwt, { JwtPayload } from "jsonwebtoken";
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

  getTokenExpDate(token: string): Date {
    const decoded = jwt.decode(token) as JwtPayload;
    if (decoded?.exp) {
      return new Date(decoded?.exp * 1000);
    }
    return new Date();
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
