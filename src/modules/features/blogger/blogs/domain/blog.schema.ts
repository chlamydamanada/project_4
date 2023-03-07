import mongoose, { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { creatingBlogDtoType } from '../types/creatingBlogDtoType';
import { BannedUserForBlogType } from '../types/bannedUserForBlogType';

export type BlogEntity = HydratedDocument<Blog>;
@Schema({ validateBeforeSave: true })
class BannedUser {
  @Prop({ required: true, type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
  @Prop({ required: true })
  login: string;
  @Prop({ required: true })
  isBanned: boolean;
  @Prop({ required: true })
  banDate: string;
  @Prop({ required: true })
  banReason: string;
}
const BannedUserSchema = SchemaFactory.createForClass(BannedUser);

@Schema()
export class Blog {
  //@Prop({ type: SchemaTypes.ObjectId })
  //_id: ObjectId;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  ownerLogin: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  isMembership: boolean;

  @Prop({ required: true })
  isOwnerBanned: boolean;

  @Prop({ required: true })
  isBanned: boolean;

  @Prop({ type: String })
  banDate: string | null;

  @Prop({ type: [BannedUserSchema], required: true })
  bannedUsers: BannedUser[];

  createBlog(blogDto: creatingBlogDtoType) {
    this.ownerId = blogDto.bloggerId;
    this.ownerLogin = blogDto.bloggerLogin;
    this.name = blogDto.name;
    this.description = blogDto.description;
    this.websiteUrl = blogDto.websiteUrl;
    this.createdAt = new Date().toISOString();
    this.isMembership = false;
    this.isOwnerBanned = false;
    this.isBanned = false;
    this.banDate = null;
    this.bannedUsers = [];
  }
  updateBlog(blogDto) {
    this.name = blogDto.name;
    this.description = blogDto.description;
    this.websiteUrl = blogDto.websiteUrl;
  }

  updateOwnerId(ownerId: string, ownerLogin: string) {
    this.ownerId = ownerId;
    this.ownerLogin = ownerLogin;
  }

  banOrUnbanBlog(banStatus: boolean) {
    if (banStatus) {
      this.banDate = new Date().toISOString();
      this.isBanned = true;
    } else {
      this.isBanned = false;
      this.banDate = null;
    }
  }
  addBannedUserForBlog(user: BannedUserForBlogType) {
    this.bannedUsers.push({
      _id: user.id,
      login: user.login,
      isBanned: user.isBanned,
      banDate: user.banDate,
      banReason: user.banReason,
    });
    console.log('user = ', user);
  }
  deleteBannedUserFormBlog(userId: string) {
    this.bannedUsers = this.bannedUsers.filter(
      (u) => u._id.toString() !== userId.toString(),
    );
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.methods = {
  createBlog: Blog.prototype.createBlog,
  updateBlog: Blog.prototype.updateBlog,
  updateOwnerId: Blog.prototype.updateOwnerId,
  banOrUnbanBlog: Blog.prototype.banOrUnbanBlog,
  addBannedUserForBlog: Blog.prototype.addBannedUserForBlog,
  deleteBannedUserFormBlog: Blog.prototype.deleteBannedUserFormBlog,
};
export const BlogModel = { name: Blog.name, schema: BlogSchema };
