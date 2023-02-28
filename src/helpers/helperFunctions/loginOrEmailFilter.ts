import { BanStatusType } from '../../modules/users/usersTypes/banStatusType';

export const makeLoginOrEmailFilter = (
  login: string | undefined,
  email: string | undefined,
  banStatus: BanStatusType,
) => {
  const banFilter = makeBanStatusFilter(banStatus);
  if (login && email) {
    return {
      $or: [
        { login: { $regex: login, $options: 'i' } },
        { email: { $regex: email, $options: 'i' } },
        banFilter,
      ],
    };
  }
  if (login) {
    return { login: { $regex: login, $options: 'i' }, banFilter };
  }
  if (email) {
    return { email: { $regex: email, $options: 'i' }, banFilter };
  } else {
    return { banFilter };
  }
};

const makeBanStatusFilter = (banStatus: BanStatusType) => {
  switch (banStatus) {
    case BanStatusType.banned:
      return { 'banInfo.isBanned': true };
    case BanStatusType.notBanned:
      return { 'banInfo.isBanned': false };
    //if (banStatus === 'banned') return { 'banInfo.isBanned': true };
    //if (banStatus === 'notBanned') return { 'banInfo.isBanned': false };
    default:
      return {
        $or: [{ 'banInfo.isBanned': true }, { 'banInfo.isBanned': false }],
      };
  }
};
