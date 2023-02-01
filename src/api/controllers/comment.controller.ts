import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQweryRepository } from '../repositoriesQwery/commentsQwery.repository';
import { CommentViewType } from '../../types/commentsTypes/commentViewType';

@Controller('comments')
export class CommentsContoller {
  constructor(
    private readonly commentsQweryRepository: CommentsQweryRepository,
  ) {}
  @Get(':id')
  async getCommentByCommentId(
    @Param('id') commentId: string,
  ): Promise<CommentViewType | string> {
    try {
      const comment = await this.commentsQweryRepository.getCommentByCommentId(
        commentId,
      );
      return comment;
    } catch (e) {
      return 'comments/getCommentByCommentId' + e;
    }
  }
}
