import { BlogEntity } from '../domain/blog.schema';

export type FindAllBlogsByFiltersType = {
  blogs: BlogEntity[] | undefined;
  totalCount: number;
};
