import { ExtensionType, Result, ResultStatus } from "../types/result";

type Params<T> = {
  status: ResultStatus;
  data?: T;
  errorMessage?: string;
  extensions?: ExtensionType[];
};

export const createResultObject = <T>(params: Params<T>): Result<T> => {
  const { status, data, errorMessage, extensions } = params;
  return {
    status,
    data: data ?? null,
    errorMessage: errorMessage ?? status,
    extensions: extensions ?? [{ field: "", message: "" }],
  };
};
