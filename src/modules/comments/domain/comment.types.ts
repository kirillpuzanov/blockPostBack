import { PageAndSortInput } from "../../../core/types/page-and-sort";
import { LikeStatus } from "../../like/domain/like.types";

export type CommentLikeInfoWithStatus = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;

  likesInfo: CommentLikeInfoWithStatus;
};

export type CreateCommentInput = {
  content: string;
};

export type UpdateCommentInput = {
  content: string;
};

export type CommentDb = {
  blogId: string;
  postId: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;

  likesInfo: {
    likesCount: number;
    dislikesCount: number;
  };
};

export enum CommentsSortFields {
  createdAt = "createdAt",
  content = "content",
}

export type CommentsQueryInput = PageAndSortInput<CommentsSortFields>;
