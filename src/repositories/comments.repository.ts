import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentEntity } from '../domain/comment.schema';
import { Status, StatusEntity } from '../domain/status.schema';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentEntity>,
    @InjectModel(Status.name) private statusModel: Model<StatusEntity>,
  ) {}
  async saveComment(comment: CommentEntity): Promise<string> {
    const newComment = await comment.save();
    return newComment._id.toString();
  }

  async saveStatus(status: StatusEntity): Promise<void> {
    await status.save();
  }

  async findCommentById(commentId: string): Promise<CommentEntity | undefined> {
    const comment = await this.commentModel.findOne({
      _id: new Types.ObjectId(commentId),
    });
    if (!comment) return undefined;
    return comment;
  }

  async findStatusOfComment(
    entity: string,
    commentId: string,
    userId: string,
  ): Promise<undefined | StatusEntity> {
    const status = await this.statusModel.findOne({
      entityId: commentId,
      entity: entity,
      userId: userId,
    });
    if (!status) return undefined;
    return status;
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
