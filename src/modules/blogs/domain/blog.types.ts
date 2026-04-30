import { PageAndSortInput } from "../../../core/types/page-and-sort";

export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type CreateBlogInput = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogDb = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export enum BlogSortFields {
  createdAt = "createdAt",
  name = "name",
}

export type BlogQueryInput = PageAndSortInput<BlogSortFields> & {
  searchNameTerm?: string;
};
