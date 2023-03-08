import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { creatingBlogDtoType } from '../types/creatingBlogDtoType';
import { BannedUserForBlogType } from '../types/bannedUserForBlogType';

@Schema({ _id: false, validateBeforeSave: true })
export class BannedUser {
  @Prop({ required: true })
  id: string;
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

export type BlogEntity = HydratedDocument<Blog>;

@Schema()
export class Blog {
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
  async addBannedUserForBlog(user: BannedUserForBlogType) {
    //check is user already banned
    const isBanned = this.bannedUsers.find((u) => u.id === user.id);
    if (!isBanned) {
      // add banned user
      this.bannedUsers.push(user);
      console.log('user = ', user);
    }
    return;
  }
  async deleteBannedUserFormBlog(userId: string) {
    this.bannedUsers = this.bannedUsers.filter(
      (u) => u.id.toString() !== userId.toString(),
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
