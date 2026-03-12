import { ResultStatus } from "../types/result";
import { HTTP_STATUS } from "../const/statuses";

type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

export const mapResultToHttpStatus = (resStatus: ResultStatus): HttpStatus => {
  switch (resStatus) {
    case ResultStatus.BadRequest:
      return HTTP_STATUS.badRequest;

    case ResultStatus.Forbidden:
      return HTTP_STATUS.forbidden;

    case ResultStatus.NotFound:
      return HTTP_STATUS.notFound;

    case ResultStatus.Success:
      return HTTP_STATUS.ok;

    case ResultStatus.Unauthorized:
      return HTTP_STATUS.unAuthorized;

    default:
      return HTTP_STATUS.serverError;
  }
};
