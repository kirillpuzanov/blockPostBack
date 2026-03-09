import { UserDb, UsersQueryInput, UserViewModel } from "../types/user.types";
import { PagedOutput } from "../../../core/types/page-and-sort";
import { userCollection } from "../../../db/database";
import { getPaginatedOutput } from "../../../core/utils/get-paginated-output";
import { ObjectId, WithId } from "mongodb";
import { NotFoundError } from "../../../core/errors/error.handler";

export const usersQueryRepository = {
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

    const filter: Record<"$or", object[]> = {
      $or: [],
    };

    if (searchLoginTerm) {
      filter.$or.push({ login: { $regex: searchLoginTerm, $options: "i" } });
    }
    if (searchEmailTerm) {
      filter.$or.push({ email: { $regex: searchEmailTerm, $options: "i" } });
    }

    const users = await userCollection
      .find(filter)
      .sort([sortBy, sortDirection])
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await userCollection.countDocuments(filter);

    const usersView = users.map(this._mapToUserView);

    return getPaginatedOutput(usersView, {
      pageNumber,
      pageSize,
      totalCount,
    });
  },

  async getById(id: string): Promise<UserViewModel> {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      throw new NotFoundError("user does not exists", "userId");
    }
    return this._mapToUserView(user);
  },

  async getByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<WithId<UserDb> | null> {
    return userCollection.findOne({
      $or: [
        { login: { $regex: loginOrEmail } },
        { email: { $regex: loginOrEmail } },
      ],
    });
  },

  _mapToUserView(user: WithId<UserDb>): UserViewModel {
    const { email, _id, createdAt, login } = user;
    return {
      id: _id.toString(),
      email,
      login,
      createdAt,
    };
  },
};
