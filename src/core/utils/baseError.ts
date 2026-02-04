import { BaseError } from "../types/baseError";

export const createBaseError = (errors: BaseError[]) => {
  return { errorsMessages: errors };
};
