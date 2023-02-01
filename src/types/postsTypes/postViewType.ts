import { extendedLikesInfoType } from '../statusTypes/extendedLikesInfoOfPostType';

export type postViewType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: extendedLikesInfoType;
};
