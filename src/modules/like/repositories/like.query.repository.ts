import { injectable } from "inversify";
import { UserLikes } from "../domain/like.types";
import { LikeModel } from "../domain/like.entity";

@injectable()
export class LikeQueryRepository {
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
