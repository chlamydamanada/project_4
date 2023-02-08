import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentEntity } from '../domain/comment.schema';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentEntity>,
  ) {}
  async saveComment(comment: CommentEntity): Promise<string> {
    const newComment = await comment.save();
    return newComment._id.toString();
  }

  async findCommentById(commentId: string): Promise<CommentEntity | undefined> {
    const comment = await this.commentModel.findOne({
      _id: new Types.ObjectId(commentId),
    });
    if (!comment) return undefined;
    return comment;
  }

  async deleteCommentById(commentId: string): Promise<void> {
    await this.commentModel.deleteOne({ _id: new Types.ObjectId(commentId) });
    return;
  }
  async deleteAllComments(): Promise<void> {
    await this.commentModel.deleteMany({});
    return;
  }
}
