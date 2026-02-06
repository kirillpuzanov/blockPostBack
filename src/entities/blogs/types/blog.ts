export type Blog = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogInputDTO = Omit<Blog, "id">;
