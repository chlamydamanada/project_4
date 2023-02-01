export const makeLoginOrEmailFilter = (
  login: string | undefined,
  email: string | undefined,
) => {
  if (login && email) {
    return {
      $or: [
        { login: { $regex: login, $options: 'i' } },
        { email: { $regex: email, $options: 'i' } },
      ],
    };
  }
  if (login) {
    return { login: { $regex: login, $options: 'i' } };
  }
  if (email) {
    return { email: { $regex: email, $options: 'i' } };
  } else {
    return {};
  }
};
