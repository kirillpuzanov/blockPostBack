export enum ResultStatus {
  Success = "Success",
  NotFound = "NotFound",
  Forbidden = "Forbidden",
  Unauthorized = "Unauthorized",
  BadRequest = "BadRequest",
}

export type ExtensionType = {
  field: string;
  message: string;
};

export type Result<T> = {
  status: ResultStatus;
  errorMessage: string;
  extensions: ExtensionType[];
  data: T | null;
};
