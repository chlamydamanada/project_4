import { PostEntity } from '../domain/post.schema';
import { makeViewPost } from './makerViewPost';

export const makeViewPosts = (
  posts: PostEntity[],
  totalCount: number,
  pS: number,
  pN: number,
) => {
  const result = {
    pagesCount: Math.ceil(totalCount / pS),
    page: pN,
    pageSize: pS,
    totalCount: totalCount,
    items: posts.map((p) => makeViewPost(p)),
  };
  return result;
};
