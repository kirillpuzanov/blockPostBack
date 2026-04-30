import mongoose from "mongoose";
import { AuthSessionDb } from "./session.types";

const SESSIONS_COLLECTION_NAME = "authDeviceSessions";

const SessionSchema = new mongoose.Schema<AuthSessionDb>({
  userId: { type: String, require: true },
  deviceId: { type: String, require: true },
  deviceName: { type: String, require: true },

  ip: { type: String, require: true },
  iat: { type: Number, require: true },
  exp: { type: Number, require: true },
});

export const SessionModel = mongoose.model<AuthSessionDb>(
  "SessionModel",
  SessionSchema,
  SESSIONS_COLLECTION_NAME,
);
