import { Injectable } from '@nestjs/common';
import { CommentsViewType } from '../../types/commentsTypes/commentsViewType';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentEntity } from '../../domain/comment.schema';
import { Model, Types } from 'mongoose';
import { commentQueryType } from '../../types/commentsTypes/commentQweryType';
import { CommentViewType } from '../../types/commentsTypes/commentViewType';
import { Status, StatusEntity } from '../../domain/status.schema';

@Injectable()
export class CommentsQweryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentEntity>,
    @InjectModel(Status.name) private statusModel: Model<StatusEntity>,
  ) {}
  async getAllComments(
    postId: string,
    query: commentQueryType,
    userId?: string | undefined | null,
  ): Promise<CommentsViewType> {
    // get number of all comments by filter
    const totalCount = await this.commentModel.count({ postId: postId });
    // get array of all comments by filter, get page number by page size
    const comments = await this.commentModel
      .find({ postId: postId })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
    // make view type and count the number of likes for each comment
    const result = await Promise.all(
      comments.map(async (c) => await this.makeViewComment(c, userId)),
    );
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: result,
    };
  }
  async getCommentByCommentId(
    commentId: string,
    userId?: string | undefined | null,
  ): Promise<CommentViewType | undefined> {
    //found comment by id
    const comment = await this.commentModel.findOne({
      _id: new Types.ObjectId(commentId),
    });
    if (!comment) return undefined;
    //make view type and count the number of likes for this comment
    const result = await this.makeViewComment(comment, userId);
    return result;
  }

  async makeViewComment(
    comment: CommentEntity,
    userId?: string | undefined | null,
  ) {
    // make view type of comment and count the number of likes or dislikes of comment
    const newComment = {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.userId,
        userLogin: comment.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: await this.statusModel.count({
          entityId: comment._id,
          entity: 'comment',
          status: 'Like',
        }),
        dislikesCount: await this.statusModel.count({
          entityId: comment._id,
          entity: 'comment',
          status: 'Dislike',
        }),
        myStatus: 'None',
      },
    };
    if (!userId) return newComment;

    // if there userId is, find this user's status
    const userReaction = await this.statusModel.findOne({
      entityId: comment._id,
      entity: 'comment',
      userId: userId,
    });
    // and put this status to view model of comment
    if (userReaction) {
      newComment.likesInfo.myStatus = userReaction.status;
    }
    return newComment;
  }
}
