import { BlogEntity } from '../domain/blog.schema';
import { makeViewBlog } from './makerViewBlog';

export const makeViewBlogs = (
  blogs: BlogEntity[],
  totalCount: number,
  pS: number,
  pN: number,
) => {
  const result = {
    pagesCount: Math.ceil(totalCount / pS),
    page: pN,
    pageSize: pS,
    totalCount: totalCount,
    items: blogs.map((b) => makeViewBlog(b)),
  };
  return result;
};
