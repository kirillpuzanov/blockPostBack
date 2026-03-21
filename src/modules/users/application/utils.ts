import { UserDb } from "../types/user.types";
import { v4 as idv4 } from "uuid";

const expirationConfirmCodeTimeLimit = 20 * 60 * 1000; // 20 min

export const getNewConfirmationData = () => {
  return {
    confirmationCode: idv4(),
    sentDate: new Date(),
    expirationDate: new Date(
      new Date().getTime() + expirationConfirmCodeTimeLimit,
    ),
  };
};

export const createUserDB = (
  login: string,
  email: string,
  passwordHash: string,
  isConfirmed?: boolean,
): UserDb => {
  const { confirmationCode, expirationDate, sentDate } =
    getNewConfirmationData();

  return {
    login,
    email,
    createdAt: new Date().toISOString(),
    passwordHash,
    emailConfirmation: {
      confirmationCode,
      sentDate,
      expirationDate,
      isConfirmed: !!isConfirmed,
    },
  };
};
