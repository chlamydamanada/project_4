import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { creatingBlogDtoType } from '../types/creatingBlogDtoType';

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

  createBlog(blogDto: creatingBlogDtoType) {
    this.ownerId = blogDto.bloggerId;
    this.ownerLogin = blogDto.bloggerLogin;
    this.name = blogDto.name;
    this.description = blogDto.description;
    this.websiteUrl = blogDto.websiteUrl;
    this.createdAt = new Date().toISOString();
    this.isMembership = false;
    this.isOwnerBanned = false;
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
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.methods = {
  createBlog: Blog.prototype.createBlog,
  updateBlog: Blog.prototype.updateBlog,
  updateOwnerId: Blog.prototype.updateOwnerId,
};
export const BlogModel = { name: Blog.name, schema: BlogSchema };
