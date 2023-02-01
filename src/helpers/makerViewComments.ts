import { CommentEntity } from '../domain/comment.schema';
import { makeViewComment } from './makerViewComment';

export const makeViewComments = (
  comments: CommentEntity[],
  totalCount: number,
  pS: number,
  pN: number,
) => {
  const result = {
    pagesCount: Math.ceil(totalCount / pS),
    page: pN,
    pageSize: pS,
    totalCount: totalCount,
    items: comments.map((c) => makeViewComment(c)),
  };
  return result;
};
