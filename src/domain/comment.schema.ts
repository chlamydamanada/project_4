import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { commentInputDtoType } from '../types/commentsTypes/commentInputDtoPipe';

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

  updateComment(dto: commentInputDtoType) {
    this.content = dto.content;
  }
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.methods = {
  updateComment: Comment.prototype.updateComment,
};
export const CommentModel = { name: Comment.name, schema: CommentSchema };
