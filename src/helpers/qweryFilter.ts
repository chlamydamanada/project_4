export type queryFilterResultType = {
  pageNumber: number;
  pageSize: number;
  sortDirection: 1 | -1;
  sortBy: string;
};

export const sortingQueryFields = (query: {
  sortBy: string | undefined;
  pageNumber: string | undefined;
  pageSize: string | undefined;
  sortDirection: string | undefined;
}) => {
  const pageNumber = !isNaN(Number(query.pageNumber))
    ? Number(query.pageNumber)
    : 1;
  const pageSize = !isNaN(Number(query.pageSize)) ? Number(query.pageSize) : 10;
  const sortBy = query.sortBy ? query.sortBy : 'createdAt';
  const sortDirection = query.sortDirection === 'asc' ? 1 : -1;
  const result: queryFilterResultType = {
    pageNumber,
    pageSize,
    sortDirection,
    sortBy,
  };
  return result;
};
