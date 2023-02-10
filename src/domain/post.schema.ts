import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { creatingPostDtoType } from '../types/postsTypes/creatingDtoType';

export type PostEntity = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ required: true })
  createdAt: string;

  createPost(postDto: creatingPostDtoType, blogName) {
    this.title = postDto.title;
    this.shortDescription = postDto.shortDescription;
    this.content = postDto.content;
    this.blogId = postDto.blogId;
    this.blogName = blogName;
    this.createdAt = new Date().toISOString();
  }
  updatePost(postDto) {
    this.title = postDto.title;
    this.shortDescription = postDto.shortDescription;
    this.content = postDto.content;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.methods = {
  createPost: Post.prototype.createPost,
};
export const PostModel = { name: Post.name, schema: PostSchema };
