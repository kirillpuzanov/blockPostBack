import { PageAndSortInput } from "../../../core/types/page-and-sort";

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
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
};

export enum CommentsSortFields {
  createdAt = "createdAt",
  content = "content",
}

export type CommentsQueryInput = PageAndSortInput<CommentsSortFields>;
