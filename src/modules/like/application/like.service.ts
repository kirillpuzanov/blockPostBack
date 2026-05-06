import { inject, injectable } from "inversify";
import { UsersRepository } from "../../users/repositories/users.repository";
import { LikeStatus, LikeUpdateDelta } from "../domain/like.types";
import mongoose from "mongoose";
import { createResultObject } from "../../../core/utils/create-result-object";
import { Result, ResultStatus } from "../../../core/types/result";
import { LikeRepository } from "../repositories/like.repository";

@injectable()
export class LikeService {
  constructor(
    @inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @inject(LikeRepository)
    private readonly likeRepository: LikeRepository,
  ) {}

  async updateLike(
    userId: string,
    parentId: string,
    newLikeStatus: LikeStatus,
  ): Promise<Result<LikeUpdateDelta>> {
    const session = await mongoose.startSession();
    session.startTransaction();

    let likesCountDelta: LikeUpdateDelta = {};

    try {
      const existingLike = await this.likeRepository.getLike(
        parentId,
        userId,
        session,
      );
      /** доп проверка, если статус не изменился ничего не делаем */
      if (existingLike?.status === newLikeStatus) {
        await session.commitTransaction();
        return createResultObject({
          status: ResultStatus.NoContent,
          data: likesCountDelta,
        });
      }

      /** модификация лайка */

      if (newLikeStatus === "None") {
        /** снимаем лайк / дизлайк - удаляем объект */
        if (existingLike) {
          // await this.likeRepository.deleteLike(
          //   existingLike._id.toString(),
          //   session,
          // );
          await this.likeRepository.updateLikeStatus(
            existingLike._id.toString(),
            newLikeStatus,
            session,
          );
        }
      } else {
        const user = await this.usersRepository.getById(userId);

        /** создаем / обновляем лайк */
        await this.likeRepository.upsertLike(
          parentId,
          userId,
          user?.login ?? "unknown",
          newLikeStatus,
          session,
        );
      }

      /** считаем дельты для изменения счетчиков в parent-сущности */
      likesCountDelta = this.calculateCountersDelta(
        existingLike?.status,
        newLikeStatus,
      );

      await session.commitTransaction();

      return createResultObject({
        status: ResultStatus.NoContent,
        data: likesCountDelta,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async deleteEntityAllLikes(parentId: string): Promise<void> {
    await this.likeRepository.deleteEntityAllLikes(parentId);
  }

  private calculateCountersDelta(
    oldStatus: LikeStatus | undefined,
    newStatus: LikeStatus,
  ): LikeUpdateDelta {
    let likesCount = 0;
    let dislikesCount = 0;

    const delta: LikeUpdateDelta = {};

    /** Убираем старый статус */
    if (oldStatus === LikeStatus.Like) likesCount--;
    if (oldStatus === LikeStatus.Dislike) dislikesCount--;

    /** Добавляем новый статус */
    if (newStatus === LikeStatus.Like) likesCount++;
    if (newStatus === LikeStatus.Dislike) dislikesCount++;

    if (likesCount !== 0) {
      delta.likesCount = likesCount;
    }

    if (dislikesCount !== 0) {
      delta.dislikesCount = dislikesCount;
    }

    return delta;
  }
}
