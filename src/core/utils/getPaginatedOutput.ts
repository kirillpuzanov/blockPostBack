type PageMeta = {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
};
export const getPaginatedOutput = <T>(items: T, pageData: PageMeta) => {
  const { pageNumber, pageSize, totalCount } = pageData;
  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize,
    totalCount,
    items,
  };
};
