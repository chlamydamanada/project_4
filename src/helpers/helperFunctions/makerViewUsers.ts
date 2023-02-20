import { UserEntity } from '../../domain/user.schema';
import { makeViewUser } from './makerViewUser';

export const makeViewUsers = (
  users: UserEntity[],
  totalCount: number,
  pS: number,
  pN: number,
) => {
  const result = {
    pagesCount: Math.ceil(totalCount / pS),
    page: pN,
    pageSize: pS,
    totalCount: totalCount,
    items: users.map((u) => makeViewUser(u)),
  };
  return result;
};
