import { BanStatusType } from './banStatusType';

export type userQueryType = {
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string | undefined;
  searchEmailTerm: string | undefined;
  banStatus: BanStatusType;
  sortBy: string;
  sortDirection: number;
};
