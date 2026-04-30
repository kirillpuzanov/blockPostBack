import { UserDb, UsersQueryInput, UserViewModel } from "../domain/user.types";
import { PagedOutput } from "../../../core/types/page-and-sort";
import { getPaginatedOutput } from "../../../core/utils/get-paginated-output";
import { ObjectId, WithId } from "mongodb";
import { injectable } from "inversify";
import { UserModel } from "../domain/user.entity";

@injectable()
export class UsersQueryRepository {
  async getAll(query: UsersQueryInput): Promise<PagedOutput<UserViewModel>> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    } = query;

    const skip = (pageNumber - 1) * pageSize;

    let filter = {};
    const searchedFields: Array<object> = [];

    if (searchLoginTerm) {
      searchedFields.push({
        login: { $regex: searchLoginTerm, $options: "i" },
      });
    }
    if (searchEmailTerm) {
      searchedFields.push({
        email: { $regex: searchEmailTerm, $options: "i" },
      });
    }

    if (!!searchedFields.length) {
      filter = { $or: searchedFields };
    }
    const users = await UserModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalCount = await UserModel.countDocuments(filter);

    const usersView = users.map(this._mapToUserView);

    return getPaginatedOutput(usersView, {
      pageNumber,
      pageSize,
      totalCount,
    });
  }

  async getById(id: string): Promise<UserViewModel | null> {
    const user = await UserModel.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return null;
    }
    return this._mapToUserView(user);
  }

  _mapToUserView(user: WithId<UserDb>): UserViewModel {
    const { email, _id, createdAt, login } = user;
    return {
      id: _id.toString(),
      email,
      login,
      createdAt,
    };
  }
}
