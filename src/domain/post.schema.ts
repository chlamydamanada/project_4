import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

  //createPost();

  /*checkIsPostOwenedByBlogOrThrow(blogId) {
    if (blogId !== this.blogId) {
      throw new ForbiddenException('post...');
    }
  }

  updatePost(blog: BlogEntity, postDto) {
    this.checkIsPostOwenedByBlogOrThrow(blog.id);
  }*/
}

export const PostSchema = SchemaFactory.createForClass(Post);
export const PostModel = { name: Post.name, schema: PostSchema };
