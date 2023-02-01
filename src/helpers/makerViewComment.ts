import { CommentEntity } from '../domain/comment.schema';

export const makeViewComment = (comment: CommentEntity) => {
  const newComment = {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.userId,
      userLogin: comment.userLogin,
    },
    createdAt: comment.createdAt,
    likesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
    },
  };
  return newComment;
};
