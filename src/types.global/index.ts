import { UserViewModel } from "../modules/users/types/user.types";

declare global {
  namespace Express {
    export interface Request {
      userMetaData: UserViewModel | null;
    }
  }
}
export {};
