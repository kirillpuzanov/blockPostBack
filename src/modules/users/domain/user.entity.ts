import mongoose from "mongoose";
import { UserDb } from "./user.types";

const USERS_COLLECTION_NAME = "users";

const RecoveryPassDataSchema = new mongoose.Schema(
  {
    recoveryPassCode: { type: String, required: true },
    expirationCodeDate: { type: Date, required: true },
    sentCodeDate: { type: Date, required: true },
  },
  { _id: false }, // не создавать _id для поддокумента
);

const UserSchema = new mongoose.Schema<UserDb>({
  login: { type: String, require: true },
  email: { type: String, require: true },
  createdAt: { type: String, require: true },
  passwordHash: { type: String, require: true },

  emailConfirmation: {
    confirmationCode: { type: String, require: true },
    expirationDate: { type: Date, require: true },
    sentDate: { type: Date, require: true },
    isConfirmed: { type: Boolean, require: true },
  },
  recoveryPassData: {
    type: RecoveryPassDataSchema,
    required: false,
    default: undefined,
  },
});

export const UserModel = mongoose.model<UserDb>(
  "UserModel",
  UserSchema,
  USERS_COLLECTION_NAME,
);
