export const errorsData = {
  name: {
    errorsMessages: [{ message: expect.any(String), field: 'name' }],
  },
  description: {
    errorsMessages: [{ message: expect.any(String), field: 'description' }],
  },
  website: {
    errorsMessages: [{ message: expect.any(String), field: 'websiteUrl' }],
  },
  nameAndDescription: {
    errorsMessages: [
      { message: expect.any(String), field: 'name' },
      { message: expect.any(String), field: 'description' },
    ],
  },
  nameAndWebsite: {
    errorsMessages: [
      { message: expect.any(String), field: 'name' },
      { message: expect.any(String), field: 'websiteUrl' },
    ],
  },
  descriptionAndWebsite: {
    errorsMessages: [
      { message: expect.any(String), field: 'description' },
      { message: expect.any(String), field: 'websiteUrl' },
    ],
  },
  allFiends: {
    errorsMessages: [
      { message: expect.any(String), field: 'name' },
      { message: expect.any(String), field: 'description' },
      { message: expect.any(String), field: 'websiteUrl' },
    ],
  },
};
