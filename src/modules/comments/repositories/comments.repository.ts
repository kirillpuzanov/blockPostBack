import { CommentDb } from "../domain/comment.types";
import { ObjectId, WithId } from "mongodb";
import { injectable } from "inversify";
import { CommentModel } from "../domain/comment.entity";

@injectable()
export class CommentsRepository {
  async findById(commentId: string): Promise<WithId<CommentDb> | null> {
    return CommentModel.findOne({ _id: new ObjectId(commentId) }).lean();
  }

  async create(comment: CommentDb): Promise<string> {
    const createdComment = await CommentModel.insertOne(comment);
    return createdComment._id.toString();
  }

  async update(commentId: string, content: string): Promise<number> {
    const updatedComment = await CommentModel.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { content } },
    );
    return updatedComment.matchedCount;
  }

  async updateLikes(
    commentId: string,
    likeUpdateDelta: Record<string, number>,
  ): Promise<number> {
    const updatedComment = await CommentModel.updateOne(
      { _id: new ObjectId(commentId) },
      { $inc: likeUpdateDelta },
    );
    return updatedComment.matchedCount;
  }

  async deleteOne(commentId: string): Promise<number> {
    const updatedComment = await CommentModel.deleteOne({
      _id: new ObjectId(commentId),
    });
    return updatedComment.deletedCount;
  }
}
