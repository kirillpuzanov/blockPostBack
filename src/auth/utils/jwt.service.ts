import jwt, { JwtPayload } from "jsonwebtoken";
import { SETTINGS } from "../../core/settings/settings";
import { DecodedToken } from "../types/auth.types";

export const jwtService = {
  createTokens(
    userId: string,
    deviceId: string,
  ): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign({ userId }, SETTINGS.JWT_SECRET, {
      expiresIn: "10 Sec",
    });
    const refreshToken = jwt.sign({ userId, deviceId }, SETTINGS.JWT_SECRET, {
      expiresIn: "20 Sec",
    });

    return { accessToken, refreshToken };
  },

  decodeRefreshToken(token: string): DecodedToken {
    const decoded = jwt.decode(token) as JwtPayload;
    return {
      userId: decoded.userId,
      deviceId: decoded.deviceId,
      exp: decoded?.exp
        ? new Date(decoded?.exp * 1000).toISOString()
        : new Date().toISOString(),
      iat: decoded?.iat
        ? new Date(decoded?.iat * 1000).toISOString()
        : new Date().toISOString(),
    };
  },

  async verifyToken(
    token: string,
  ): Promise<{ userId: string | null; deviceId: string | null }> {
    try {
      const verify = jwt.verify(token, SETTINGS.JWT_SECRET) as {
        userId: string;
        deviceId: string;
      };
      return {
        userId: verify.userId ?? null,
        deviceId: verify.deviceId ?? null,
      };
    } catch {
      return { userId: null, deviceId: null };
    }
  },
};
