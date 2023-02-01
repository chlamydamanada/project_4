import { Controller, Get, Param, Res } from '@nestjs/common';
import { CommentsQweryRepository } from '../repositoriesQwery/commentsQwery.repository';
import { CommentViewType } from '../../types/commentsTypes/commentViewType';
import { Response } from 'express';

@Controller('comments')
export class CommentsContoller {
  constructor(
    private readonly commentsQweryRepository: CommentsQweryRepository,
  ) {}
  @Get(':id')
  async getCommentByCommentId(
    @Param('id') commentId: string,
    @Res() res: Response,
  ): Promise<CommentViewType | string> {
    try {
      const comment = await this.commentsQweryRepository.getCommentByCommentId(
        commentId,
      );
      if (!comment) {
        res.status(404).send('Comment with this id does not exist');
        return;
      }
      res.status(200).send(comment);
    } catch (e) {
      return 'comments/getCommentByCommentId' + e;
    }
  }
}
