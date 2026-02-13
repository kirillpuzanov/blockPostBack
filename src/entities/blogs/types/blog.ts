export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
};

export type BlogInput = Omit<BlogViewModel, "id" | "createdAt">;
export type BlogDb = Omit<BlogViewModel, "id">;
