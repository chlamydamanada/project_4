import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { commentInputDtoType } from '../commentsTypes/commentInputDtoType';

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

  @Prop({ required: true })
  isOwnerBanned: boolean;

  updateComment(dto: commentInputDtoType) {
    this.content = dto.content;
  }

  createComment(
    dto: commentInputDtoType,
    postId: string,
    userId: string,
    userLogin: string,
  ) {
    this.postId = postId;
    this.content = dto.content;
    this.userId = userId;
    this.userLogin = userLogin;
    this.createdAt = new Date().toISOString();
    this.isOwnerBanned = false;
  }
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.methods = {
  updateComment: Comment.prototype.updateComment,
  createComment: Comment.prototype.createComment,
};
export const CommentModel = { name: Comment.name, schema: CommentSchema };
