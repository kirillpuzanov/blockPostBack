import { PostDb, PostViewModel } from "../../types/post";
import { WithId } from "mongodb";

export const mapToPostView = (post: WithId<PostDb>): PostViewModel => {
  const { title, shortDescription, blogId, content, blogName, createdAt, _id } =
    post;
  return {
    id: _id.toString(),
    title,
    shortDescription,
    blogId,
    content,
    blogName,
    createdAt,
  };
};
