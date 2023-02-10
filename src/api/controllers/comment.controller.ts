import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { CommentsQweryRepository } from '../repositoriesQwery/commentsQwery.repository';
import { CommentViewType } from '../../types/commentsTypes/commentViewType';
import { commentInputDtoType } from '../../types/commentsTypes/commentInputDtoPipe';
import { CommentService } from '../../application/comments.service';
import { commentInputDtoPipe } from '../pipes/comments/commentInputDtoPipe';

@Controller('comments')
export class CommentsContoller {
  constructor(
    private readonly commentsQweryRepository: CommentsQweryRepository,
    private readonly commentService: CommentService,
  ) {}
  @Get(':id')
  async getCommentByCommentId(
    @Param('id') commentId: string,
  ): Promise<CommentViewType | string> {
    const comment = await this.commentsQweryRepository.getCommentByCommentId(
      commentId,
    );
    if (!comment)
      throw new NotFoundException('Comment with this id does not exist');
    return comment;
  }
  @Put(':id')
  @HttpCode(204)
  async updateCommentByCommentId(
    @Param('id') commentId: string,
    @Body() commentInputDto: commentInputDtoPipe,
    //todo pipe for inputModel
  ): Promise<void> {
    await this.commentService.updateCommentById(commentId, commentInputDto);
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteCommentById(@Param('id') commentId: string): Promise<void> {
    await this.commentService.deleteCommentById(commentId);
    return;
  }
}
