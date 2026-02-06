import { Blog } from "../entities/blogs/types/blog";
import { Post } from "../entities/posts/types/post";

export const database = {
  blogs: <Blog[]>[
    {
      id: "1",
      name: "block-1",
      description: "description for block-1",
      websiteUrl: "https://test.com",
    },
    {
      id: "2",
      name: "block-2",
      description: "description for block-2",
      websiteUrl: "https://test-2.com",
    },
  ],

  posts: <Post[]>[],
};
