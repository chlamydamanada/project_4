import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BlogEntity = HydratedDocument<Blog>;

@Schema()
export class Blog {
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

  createBlog(blogDto) {
    this.name = blogDto.name;
    this.description = blogDto.description;
    this.websiteUrl = blogDto.websiteUrl;
    this.createdAt = new Date().toISOString();
    this.isMembership = false;
  }
  updateBlog(name, description, websiteUrl) {
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.methods = {
  createBlog: Blog.prototype.createBlog,
  updateBlog: Blog.prototype.updateBlog,
};
export const BlogModel = { name: Blog.name, schema: BlogSchema };
