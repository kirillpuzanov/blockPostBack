export type PageAndSortInput<SortFields> = {
  pageNumber: number;
  pageSize: number;
  sortDirection: keyof typeof SortDirection;
  sortBy: SortFields;
};

export type PagedOutput<Data> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Data[];
};

export enum SortDirection {
  asc = "asc",
  desc = "desc",
}
