export type PageAndSort<SortFields> = {
  pageNumber: number;
  pageSize: number;
  sortDirection: keyof typeof SortDirection;
  sortBy: SortFields;
};

export enum SortDirection {
  asc = "asc",
  desc = "desc",
}
