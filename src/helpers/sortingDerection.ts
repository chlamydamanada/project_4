export const sortingDirection = (value: string): 1 | -1 => {
  return value ? (value === 'asc' ? 1 : -1) : -1;
};
