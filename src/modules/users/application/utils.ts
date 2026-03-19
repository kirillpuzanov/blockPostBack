import { UserDb } from "../types/user.types";
import { v4 as idv4 } from "uuid";

export const createUserDB = (
  login: string,
  email: string,
  passwordHash: string,
): UserDb => {
  const expirationTimeLimit = 20 * 60 * 1000; // 20 min

  return {
    login,
    email,
    createdAt: new Date().toISOString(),
    passwordHash,
    emailConfirmation: {
      confirmationCode: idv4(),
      expirationDate: new Date(new Date().getTime() + expirationTimeLimit),
      isConfirmed: false,
    },
  };
};
