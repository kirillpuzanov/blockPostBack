import { AuthSessionViewModel } from "../types/session.types";
import { Result, ResultStatus } from "../../../core/types/result";
import { createResultObject } from "../../../core/utils/create-result-object";
import { sessionsRepository } from "../repositories/sessions.repository";
import { jwtService } from "../../../auth/utils/jwt.service";

export const sessionsService = {
  async getAllSessions(
    userId: string,
  ): Promise<Result<AuthSessionViewModel[]>> {
    const sessions = await sessionsRepository.getAllActiveSessions(userId);

    return createResultObject({
      status: ResultStatus.Success,
      data: sessions,
    });
  },

  async deleteAllMySessions(refreshToken: string): Promise<Result<null>> {
    const { userId, deviceId } = jwtService.decodeRefreshToken(refreshToken);

    await sessionsRepository.deleteOtherMySessions(userId, deviceId);

    return createResultObject({
      status: ResultStatus.NoContent,
    });
  },

  async deleteMySession(
    userId: string,
    deletedDeviceId: string,
  ): Promise<Result<null>> {
    const deletedSession = await sessionsRepository.getSession(deletedDeviceId);

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

    const deletedCount = await sessionsRepository.deleteSession(
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
  },
};
