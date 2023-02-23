export const blogsData = {
  emptyBlogs: {
    pagesCount: 0,
    page: 1,
    pageSize: 10,
    totalCount: 0,
    items: [],
  },
  validBlog_1: {
    name: 'Bob',
    description: 'Some valid string',
    websiteUrl: 'https://Bob-test.com',
  },
  validBlog_2: {
    name: 'Sam',
    description: 'Some valid string',
    websiteUrl: 'https://Sam-test.com',
  },
  validBlog_3: {
    name: 'Lora',
    description: 'Some valid string',
    websiteUrl: 'https://Lora-test.com',
  },
  validBlog_4: {
    name: 'Kate',
    description: 'Some valid string',
    websiteUrl: 'https://Kate-test.com',
  },
  validBlog_5: {
    name: 'David',
    description: 'Some valid string',
    websiteUrl: 'https://David-test.com',
  },
  validBlog_6: {
    name: 'Sabina',
    description: 'Some valid string',
    websiteUrl: 'https://Sabina-test.com',
  },
  validBlog_7: {
    name: 'Lilit',
    description: 'Some valid string',
    websiteUrl: 'https://Lilit-test.com',
  },
  validBlog_8: {
    name: 'Travis',
    description: 'Some valid string',
    websiteUrl: 'https://Travis-test.com',
  },
  validBlog_9: {
    name: 'Lukash',
    description: 'Some valid string',
    websiteUrl: 'https://Lukash-test.com',
  },
  validBlog_10: {
    name: 'Robert',
    description: 'Some valid string',
    websiteUrl: 'https://Robert-test.com',
  },
  validBlog_11: {
    name: 'Pavel',
    description: 'Some valid string',
    websiteUrl: 'https://Pavel-test.com',
  },
  validBlog_12: {
    name: 'Anna',
    description: 'Some valid string',
    websiteUrl: 'https://anna-test.com',
  },
  invalidBlog_name_1: {
    name: '',
    description: 'Some valid string',
    websiteUrl: 'https://someValidString.com',
  },
  invalidBlog_name_2: {
    name: '                                 ',
    description: 'Some valid string',
    websiteUrl: 'https://someValidString.com',
  },
  invalidBlog_name_3: {
    name: 5555555,
    description: 'Some valid string',
    websiteUrl: 'https://someValidString.com',
  },
  invalidBlog_name_4: {
    name: 'Very Very Very Very Very Very Very Very Very Very Very Very Very Very long string',
    description: 'Some valid string',
    websiteUrl: 'https://someValidString.com',
  },
  invalidBlog_description_1: {
    name: 'String',
    description: '',
    websiteUrl: 'https://someValidString.com',
  },
  invalidBlog_description_2: {
    name: 'String',
    description: '                                 ',
    websiteUrl: 'https://someValidString.com',
  },
  invalidBlog_description_3: {
    name: 'String',
    description: 5555555,
    websiteUrl: 'https://someValidString.com',
  },
  invalidBlog_description_4: {
    name: 'String',
    description:
      'Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very ' +
      'Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very ' +
      'Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very ' +
      'Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very ' +
      'Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very ' +
      'Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very ' +
      'Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very ' +
      'Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very ' +
      'Very Very Very Very Very Very Very Very Very Very Very Very Very Very Very ' +
      'Very Very Very Very Very Very Very Very Very Very Very Very Very long string',
    websiteUrl: 'https://someValidString.com',
  },
  invalidBlog_website_1: {
    name: 'String',
    description: 'Some valid string',
    websiteUrl: '',
  },
  invalidBlog_website_2: {
    name: 'String',
    description: 'Some valid string',
    websiteUrl: '                           ',
  },
  invalidBlog_website_3: {
    name: 'String',
    description: 'Some valid string',
    websiteUrl: 55555555,
  },
  invalidBlog_website_4: {
    name: 'String',
    description: 'Some valid string',
    websiteUrl:
      'https://VeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVery' +
      'VeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVerylongstring.com',
  },
  invalidBlog_website_5: {
    name: 'String',
    description: 'Some valid string',
    websiteUrl: 'Some string',
  },
  invalidBlog_nameAndDescription: {
    name: '',
    description: '',
    websiteUrl: 'https://someValidString.com',
  },
  invalidBlog_nameAndWebsite: {
    name: '',
    description: 'Some valid string',
    websiteUrl: '',
  },
  invalidBlog_descriptionAndWebsite: {
    name: 'Some string',
    description: '',
    websiteUrl: '',
  },
  invalidBlog_allFields: {
    name: '',
    description: '',
    websiteUrl: '',
  },
};
