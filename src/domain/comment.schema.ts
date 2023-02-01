import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentEntity = HydratedDocument<Comment>;
@Schema()
export class Comment {
  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userLogin: string;

  @Prop({ required: true })
  createdAt: string;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
export const CommentModel = { name: Comment.name, schema: CommentSchema };
