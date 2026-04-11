export type AuthSessionDb = {
  userId: string;
  deviceId: string;
  deviceName: string;

  ip: string;

  iat: number;
  exp: number;
};
export type AuthSessionViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};
