export type LoginInput = {
  loginOrEmail: string;
  password: string;
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

export type BlackListToken = {
  token: string;
  expireDate: string;
};
