import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { creatingPostDtoType } from '../postsTypes/creatingDtoType';

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
  isBlogBanned: boolean;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ required: true })
  isOwnerBanned: boolean;

  createPost(postDto: creatingPostDtoType, blogName) {
    this.title = postDto.title;
    this.shortDescription = postDto.shortDescription;
    this.content = postDto.content;
    this.blogId = postDto.blogId;
    this.ownerId = postDto.bloggerId;
    this.blogName = blogName;
    this.createdAt = new Date().toISOString();
    this.isOwnerBanned = false;
    this.isBlogBanned = false;
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
  updatePost: Post.prototype.updatePost,
};

export const PostModel = { name: Post.name, schema: PostSchema };
