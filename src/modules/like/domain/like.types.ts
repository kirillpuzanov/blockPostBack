export enum LikeStatus {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}

export type LikeInput = {
  likeStatus: LikeStatus;
};

export type LikeInfo = {
  likesCount: number;
  dislikesCount: number;
};

export type LikeDb = {
  parentId: string;
  createdAt: Date;
  status: LikeStatus;
  author: {
    userId: string;
    userLogin: string;
  };
};

export type UserLikes = Record<string, LikeStatus>;
export type LikeUpdateDelta = {
  likesCount?: number;
  dislikesCount?: number;
};
