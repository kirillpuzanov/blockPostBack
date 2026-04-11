export type LoginInput = {
  loginOrEmail: string;
  password: string;
};

export type LoginInputWithMeta = {
  loginOrEmail: string;
  password: string;
  ip: string;
  deviceName: string;
};

export type RegistrationInput = {
  login: string;
  email: string;
  password: string;
};

export type MeViewModel = {
  userId: string;
  login: string;
  email: string;
};

export type DecodedToken = {
  userId: string;
  deviceId: string;
  exp: string;
  iat: string;
};

export type AuthSessionDb = {
  userId: string;
  deviceId: string;
  deviceName: string;

  ip: string;

  iat: string;
  exp: string;
};

export type AuthSessionViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};
