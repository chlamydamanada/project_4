export type userQueryType = {
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string | undefined;
  searchEmailTerm: string | undefined;
  sortBy: string;
  sortDirection: number;
};
