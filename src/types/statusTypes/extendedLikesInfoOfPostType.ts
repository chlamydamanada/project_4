import { newestLikesForPostType } from './newestLikesForPostType';

export type extendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: newestLikesForPostType[];
};
