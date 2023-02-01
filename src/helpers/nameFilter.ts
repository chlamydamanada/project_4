export const makeNameFilter = (name: string | undefined) => {
  if (name) {
    return { name: { $regex: name, $options: 'i' } };
  } else {
    return {};
  }
};
