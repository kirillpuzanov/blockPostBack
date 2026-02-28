import { PageAndSort } from "../../../core/types/pageAndSort";

export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type BlogInput = Omit<
  BlogViewModel,
  "id" | "createdAt" | "isMembership"
>;

export type BlogDb = Omit<BlogViewModel, "id">;

export enum BlogSortFields {
  createdAt = "createdAt",
  name = "name",
}

export enum PostsByBlogSortFields {
  createdAt = "createdAt",
  title = "title",
  blogName = "blogName",
}

export type BlogQueryInput = PageAndSort<BlogSortFields> & {
  searchNameTerm?: string;
};

export type PostsByBlogQueryInput = PageAndSort<PostsByBlogSortFields>;
