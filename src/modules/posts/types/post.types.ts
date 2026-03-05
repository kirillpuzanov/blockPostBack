import { PageAndSortInput } from "../../../core/types/page-and-sort";

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type CreatePostInput = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type PostDb = Omit<PostViewModel, "id">;

export type CreatePostByBlogInput = {
  title: string;
  shortDescription: string;
  content: string;
};

export enum PostSortFields {
  createdAt = "createdAt",
  title = "title",
  blogName = "blogName",
}

export type PostsQueryInput = PageAndSortInput<PostSortFields>;

export enum PostsByBlogSortFields {
  createdAt = "createdAt",
  title = "title",
  blogName = "blogName",
}

export type PostsByBlogQueryInput = PageAndSortInput<PostsByBlogSortFields>;
