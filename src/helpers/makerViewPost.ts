import { PostEntity } from '../domain/post.schema';
import { postViewType } from '../types/postsTypes/postViewType';

export const makeViewPost = (post: PostEntity): postViewType => {
  const newPost = {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [
        {
          addedAt: '2023-01-27T21:02:46.743Z',
          userId: 'string',
          login: 'string',
        },
      ],
    },
  };
  return newPost;
};
