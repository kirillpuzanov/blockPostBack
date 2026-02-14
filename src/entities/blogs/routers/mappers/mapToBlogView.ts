import { WithId } from "mongodb";
import { BlogDb, BlogViewModel } from "../../types/blog";

export const mapToBlogView = (blog: WithId<BlogDb>): BlogViewModel => {
  const { _id, createdAt, websiteUrl, description, name, isMembership } = blog;
  return {
    id: _id.toString(),
    name,
    description,
    websiteUrl,
    createdAt,
    isMembership,
  };
};
