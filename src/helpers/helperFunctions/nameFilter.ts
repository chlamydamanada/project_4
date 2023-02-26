export const makeNameFilter = (
  name: string | undefined,
  bloggerId?: string | null | undefined,
) => {
  if (name && bloggerId) {
    return { name: { $regex: name, $options: 'i' }, ownerId: bloggerId };
  }
  if (name) {
    return { name: { $regex: name, $options: 'i' } };
  }
  if (bloggerId) {
    return { ownerId: bloggerId };
  }
  return {};
};
