import { Types } from 'mongoose';

export type BannedUserForBlogType = {
  id: Types.ObjectId;
  login: string;
  isBanned: boolean;
  banDate: string;
  banReason: string;
};
