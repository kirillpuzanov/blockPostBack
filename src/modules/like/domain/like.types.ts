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

export type LikeInfoWithStatus = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
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
  "likesInfo.likesCount"?: number;
  "likesInfo.dislikesCount"?: number;
};
