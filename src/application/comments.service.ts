import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepository } from '../repositories/comments.repository';
import { commentInputDtoType } from '../types/commentsTypes/commentInputDtoPipe';

@Injectable()
export class CommentService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async updateCommentById(
    commentId: string,
    commentInputDto: commentInputDtoType,
  ): Promise<void> {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment)
      throw new NotFoundException('Comment with this id does not exist');
    comment.updateComment(commentInputDto);
    await this.commentsRepository.saveComment(comment);
    return;
  }

  async deleteCommentById(commentId: string): Promise<void> {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment)
      throw new NotFoundException('Comment with this id does not exist');
    //if(comment.userId !== userId)
    //throw new ForbiddenException('You try delete the comment that is not your own');
    await this.commentsRepository.deleteCommentById(commentId);
    return;
  }
  async deleteAllComments(): Promise<void> {
    await this.commentsRepository.deleteAllComments();
    return;
  }
}
