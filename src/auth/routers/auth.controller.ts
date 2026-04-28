import { Request, Response } from "express";
import {
  LoginInput,
  MeViewModel,
  RegistrationInput,
} from "../types/auth.types";
import { ResultStatus } from "../../core/types/result";
import { mapResultToHttpStatus } from "../../core/utils/map-result-to-http-status";
import { HTTP_STATUS } from "../../core/const/statuses";
import {
  createErrorMessages,
  errorHandler,
} from "../../core/errors/error.handler";
import { UsersQueryRepository } from "../../modules/users/repositories/users.query.repository";
import { AuthService } from "../application/auth.service";
import { inject, injectable } from "inversify";

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) public authService: AuthService,
    @inject(UsersQueryRepository)
    public usersQueryRepository: UsersQueryRepository,
  ) {}

  async login(req: Request<{}, {}, LoginInput>, res: Response) {
    try {
      const { password, loginOrEmail } = req.body;

      const ip = req.ip ?? "";
      const ua = req.useragent;
      const deviceName = `${ua?.browser ?? "unknown"} ${ua?.version ?? "unknown"}`;

      const result = await this.authService.login({
        password,
        loginOrEmail,
        deviceName,
        ip,
      });

      if (result.status === ResultStatus.Success) {
        return res
          .cookie("refreshToken", result.data!.refreshToken, {
            httpOnly: true,
            secure: true,
          })
          .status(mapResultToHttpStatus(result.status))
          .send({ accessToken: result.data!.accessToken });
      }

      return res.sendStatus(HTTP_STATUS.unAuthorized);
    } catch (e) {
      errorHandler(e, res);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;

      const result = await this.authService.logout(refreshToken);

      if (result.status === ResultStatus.NoContent) {
        return res
          .clearCookie("refreshToken", { path: "/" })
          .sendStatus(HTTP_STATUS.noContent);
      }

      return res.sendStatus(HTTP_STATUS.unAuthorized);
    } catch (e) {
      errorHandler(e, res);
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;

      const result = await this.authService.refreshTokens(refreshToken);

      if (result.status === ResultStatus.Success) {
        return res
          .cookie("refreshToken", result.data!.refreshToken, {
            httpOnly: true,
            secure: true,
          })
          .status(HTTP_STATUS.ok)
          .send({ accessToken: result.data!.accessToken });
      }
      return res.sendStatus(HTTP_STATUS.unAuthorized);
    } catch (e) {
      errorHandler(e, res);
    }
  }

  async getMe(req: Request<{}, MeViewModel, LoginInput>, res: Response) {
    const userId = req.userMetaData?.id;

    const user = await this.usersQueryRepository.getById(userId!);

    if (!user) {
      res.sendStatus(HTTP_STATUS.unAuthorized);
      return;
    }
    const { id, login, email } = user;
    const meView: MeViewModel = { userId: id, login, email };

    res.status(HTTP_STATUS.ok).send(meView);
  }

  async registration(req: Request<{}, {}, RegistrationInput>, res: Response) {
    try {
      const { password, email, login } = req.body;

      const result = await this.authService.registration(
        password,
        email,
        login,
      );

      if (result.status === ResultStatus.NoContent) {
        return res.sendStatus(HTTP_STATUS.noContent);
      }

      return res
        .status(mapResultToHttpStatus(result.status))
        .send(createErrorMessages(result.extensions));
    } catch (e) {
      errorHandler(e, res);
    }
  }

  async registrationConfirm(
    req: Request<{}, {}, { code: string }>,
    res: Response,
  ) {
    try {
      const { code } = req.body;

      const result = await this.authService.registrationConfirm(code);

      if (result.status === ResultStatus.NoContent) {
        return res.sendStatus(HTTP_STATUS.noContent);
      }

      return res
        .status(mapResultToHttpStatus(result.status))
        .send(createErrorMessages(result.extensions));
    } catch (e) {
      errorHandler(e, res);
    }
  }

  async registrationResendConfirm(
    req: Request<{}, {}, { email: string }>,
    res: Response,
  ) {
    try {
      const { email } = req.body;

      const result = await this.authService.registrationResendConfirm(email);

      if (result.status === ResultStatus.NoContent) {
        return res.sendStatus(HTTP_STATUS.noContent);
      }

      return res
        .status(mapResultToHttpStatus(result.status))
        .send(createErrorMessages(result.extensions));
    } catch (e) {
      errorHandler(e, res);
    }
  }

  async recoveryPass(req: Request<{}, {}, { email: string }>, res: Response) {
    try {
      const { email } = req.body;

      const result = await this.authService.recoveryPassword(email);

      if (result.status === ResultStatus.NoContent) {
        return res.sendStatus(HTTP_STATUS.noContent);
      }

      return res
        .status(mapResultToHttpStatus(result.status))
        .send(createErrorMessages(result.extensions));
    } catch (e) {
      errorHandler(e, res);
    }
  }

  async setNewPassword(
    req: Request<{}, {}, { newPassword: string; recoveryCode: string }>,
    res: Response,
  ) {
    try {
      const { newPassword, recoveryCode } = req.body;

      const result = await this.authService.setNewPassword(
        newPassword,
        recoveryCode,
      );

      if (result.status === ResultStatus.NoContent) {
        return res.sendStatus(HTTP_STATUS.noContent);
      }

      return res
        .status(mapResultToHttpStatus(result.status))
        .send(createErrorMessages(result.extensions));
    } catch (e) {
      errorHandler(e, res);
    }
  }
}
