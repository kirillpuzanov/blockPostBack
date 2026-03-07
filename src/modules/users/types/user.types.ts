import { PageAndSortInput } from "../../../core/types/page-and-sort";

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type CreateUserInput = {
  login: string;
  password: string;
  email: string;
};

export type UserDb = {
  login: string;
  email: string;
  createdAt: string;
  passwordHash: string;
};

export enum UsersSortFields {
  createdAt = "createdAt",
  login = "login",
  email = "email",
}

export type UsersQueryInput = PageAndSortInput<UsersSortFields> & {
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};
