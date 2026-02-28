import { PageAndSort } from "../../../core/types/pageAndSort";

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostInput = Omit<PostViewModel, "id" | "blogName" | "createdAt">;
export type PostDb = Omit<PostViewModel, "id">;

export enum PostSortFields {
  createdAt = "createdAt",
}

export type PostsQueryInput = PageAndSort<PostSortFields>;
