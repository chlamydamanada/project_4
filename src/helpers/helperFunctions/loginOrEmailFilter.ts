import { BanStatusType } from '../../modules/features/superAdmin/users/usersTypes/banStatusType';

export const makeLoginOrEmailFilter = (
  login: string | undefined,
  email: string | undefined,
  banStatus: BanStatusType,
) => {
  const banFilter = makeBanStatusFilter(banStatus);

  if (login && email) {
    return {
      $and: [
        {
          $or: [
            { login: { $regex: login, $options: 'i' } },
            { email: { $regex: email, $options: 'i' } },
          ],
        },
        banFilter,
      ],
    };
  }
  if (login) {
    return {
      $and: [{ login: { $regex: login, $options: 'i' } }, banFilter],
    };
  }
  if (email) {
    return {
      $and: [{ email: { $regex: email, $options: 'i' } }, banFilter],
    };
  } else {
    return banFilter;
  }
};

const makeBanStatusFilter = (banStatus: BanStatusType) => {
  //if (banStatus === 'banned') return { 'banInfo.isBanned': true };
  //if (banStatus === 'notBanned') return { 'banInfo.isBanned': false };
  switch (banStatus) {
    case BanStatusType.banned:
      return { 'banInfo.isBanned': true };
    case BanStatusType.notBanned:
      return { 'banInfo.isBanned': false };

    default:
      return {};
    //$or: [{ 'banInfo.isBanned': true }, { 'banInfo.isBanned': false }],
  }
};
