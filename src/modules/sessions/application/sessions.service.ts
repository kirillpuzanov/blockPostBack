import { AuthSessionViewModel } from "../types/session.types";
import { Result, ResultStatus } from "../../../core/types/result";
import { createResultObject } from "../../../core/utils/create-result-object";
import { SessionsRepository } from "../repositories/sessions.repository";
import { JwtService } from "../../../auth/utils/jwt.service";

export class SessionsService {
  constructor(
    public sessionsRepository: SessionsRepository,
    public jwtService: JwtService,
  ) {}

  async getAllSessions(
    userId: string,
  ): Promise<Result<AuthSessionViewModel[]>> {
    const sessions = await this.sessionsRepository.getAllActiveSessions(userId);

    return createResultObject({
      status: ResultStatus.Success,
      data: sessions,
    });
  }

  async deleteAllMySessions(refreshToken: string): Promise<Result<null>> {
    const { userId, deviceId } =
      this.jwtService.decodeRefreshToken(refreshToken);

    await this.sessionsRepository.deleteOtherMySessions(userId, deviceId);

    return createResultObject({
      status: ResultStatus.NoContent,
    });
  }

  async deleteMySession(
    userId: string,
    deletedDeviceId: string,
  ): Promise<Result<null>> {
    const deletedSession =
      await this.sessionsRepository.getSession(deletedDeviceId);

    if (!deletedSession) {
      return createResultObject({
        status: ResultStatus.NotFound,
      });
    }

    if (deletedSession.userId !== userId) {
      return createResultObject({
        status: ResultStatus.Forbidden,
      });
    }

    const deletedCount = await this.sessionsRepository.deleteSession(
      userId,
      deletedDeviceId,
    );

    if (deletedCount > 0) {
      return createResultObject({
        status: ResultStatus.NoContent,
      });
    }
    return createResultObject({
      status: ResultStatus.NotFound,
    });
  }
}
