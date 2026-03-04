import { PageAndSort } from "../../../core/types/page-and-sort";

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type CreatePostByBlogInput = Omit<
  PostViewModel,
  "blogId" | "id" | "blogName" | "createdAt"
>;
export type PostInput = Omit<PostViewModel, "id" | "blogName" | "createdAt">;
export type PostDb = Omit<PostViewModel, "id">;

export enum PostSortFields {
  createdAt = "createdAt",
  title = "title",
  blogName = "blogName",
}

export type PostsQueryInput = PageAndSort<PostSortFields>;
