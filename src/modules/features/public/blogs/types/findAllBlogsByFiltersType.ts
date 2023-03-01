import { BlogEntity } from '../../../blogger/blogs/domain/blog.schema';

export type FindAllBlogsByFiltersType = {
  blogs: BlogEntity[] | undefined;
  totalCount: number;
};
