export type blogQueryType = {
  searchNameTerm?: string | undefined;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 1 | -1;
};
