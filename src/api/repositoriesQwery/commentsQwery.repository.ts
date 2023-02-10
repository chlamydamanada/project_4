import { Injectable } from '@nestjs/common';
import { CommentsViewType } from '../../types/commentsTypes/commentsViewType';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentEntity } from '../../domain/comment.schema';
import { Model, Types } from 'mongoose';
import { makeViewComment } from '../../helpers/makerViewComment';
import { commentQueryType } from '../../types/commentsTypes/commentQweryType';
import { sortingQueryFields } from '../../helpers/qweryFilter';
import { makeViewComments } from '../../helpers/makerViewComments';

@Injectable()
export class CommentsQweryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentEntity>,
  ) {}
  async getAllComments(
    postId: string,
    query: commentQueryType,
  ): Promise<CommentsViewType> {
    const totalCount = await this.commentModel.count({ postId: postId });
    const comments = await this.commentModel
      .find({ postId: postId })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
    const result = makeViewComments(
      comments,
      totalCount,
      query.pageSize,
      query.pageNumber,
    );
    return result;
  }
  async getCommentByCommentId(commentId: string) {
    const comment = await this.commentModel.findOne({
      _id: new Types.ObjectId(commentId),
    });
    if (!comment) return undefined;
    const result = makeViewComment(comment);
    return result;
  }
}
