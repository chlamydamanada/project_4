import { UserEntity } from '../../domain/user.schema';

export const makeViewUser = (user: UserEntity) => {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
