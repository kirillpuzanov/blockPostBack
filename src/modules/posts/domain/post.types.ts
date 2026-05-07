import { PageAndSortInput } from "../../../core/types/page-and-sort";
import { LikeStatus } from "../../like/domain/like.types";

type NewestLikes = {
  addedAt: string;
  userId: string;
  login: string;
};

type PostLikeInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: NewestLikes[];
};

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;

  extendedLikesInfo: PostLikeInfo;
};

export type CreatePostInput = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type PostDb = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;

  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    newestLikes: NewestLikes[];
  };
};

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
