import { injectable } from "inversify";
import {
  LikeInfo,
  LikeInfoWithStatus,
  LikeStaus,
  UserLikes,
} from "../domain/like.types";
import { LikeModel } from "../domain/like.entity";

@injectable()
export class LikeQueryRepository {
  getWithUserLikeStatus<T extends { id: string; likesInfo: LikeInfo }>(
    entity: T,
    myLikes: UserLikes,
  ): T & { likesInfo: LikeInfoWithStatus } {
    return {
      ...entity,
      likesInfo: {
        ...entity.likesInfo,
        myStatus: myLikes[entity.id] ?? LikeStaus.None,
      },
    };
  }

  async getUserLikes(
    userId: string | undefined,
    entityIds: string[],
  ): Promise<UserLikes> {
    let myLikes = {} as UserLikes;

    if (userId) {
      const userLikes = await LikeModel.find({
        "author.userId": userId,
        parentId: { $in: entityIds },
      }).lean();

      if (userLikes.length > 0) {
        userLikes.forEach((el) => {
          myLikes[el.parentId] = el.status;
        });
      }
    }

    return myLikes;
  }
}
