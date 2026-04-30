import jwt, { JwtPayload } from "jsonwebtoken";
import { SETTINGS } from "../../core/settings/settings";
import { DecodedToken } from "../domain/auth.types";
import { injectable } from "inversify";

@injectable()
export class JwtService {
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
  }

  decodeRefreshToken(token: string): DecodedToken {
    const decoded = jwt.decode(token) as JwtPayload;
    return {
      userId: decoded.userId,
      deviceId: decoded.deviceId,
      /**  переводим в миллисеунды, для удобства сравнения дальше */
      exp: decoded?.exp ? decoded.exp * 1000 : Date.now(),
      iat: decoded?.iat ? decoded.iat * 1000 : Date.now(),
    };
  }

  async verifyToken(
    token: string,
  ): Promise<{ userId: string | null; deviceId: string | null; iat: number }> {
    try {
      const verify = jwt.verify(token, SETTINGS.JWT_SECRET) as {
        userId: string;
        deviceId: string;
        iat: number;
      };
      return {
        userId: verify.userId ?? null,
        deviceId: verify.deviceId ?? null,
        iat: verify?.iat ? verify?.iat * 1000 : Date.now(),
      };
    } catch {
      return { userId: null, deviceId: null, iat: Date.now() };
    }
  }
}
