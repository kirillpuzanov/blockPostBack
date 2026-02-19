export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type BlogInput = Omit<
  BlogViewModel,
  "id" | "createdAt" | "isMembership"
>;
export type BlogDb = Omit<BlogViewModel, "id">;
