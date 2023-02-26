import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsQweryRepository } from './qweryRepositories/commentsQwery.repository';
import { AccessTokenGuard } from '../../auth/guards/accessTokenAuth.guard';
import { CommentService } from '../application/comments.service';
import { ExtractUserIdFromAT } from '../../auth/guards/extractUserIdFromAT.guard';
import { CurrentUserId } from '../../../helpers/decorators/currentUserId.decorator';
import { StatusPipe } from '../../status/api/pipes/statusPipe';
import { commentInputDtoPipe } from './pipes/commentInputDtoPipe';
import { CommentViewType } from '../commentsTypes/commentViewType';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQweryRepository: CommentsQweryRepository,
    private readonly commentService: CommentService,
  ) {}

  @Get(':id')
  @UseGuards(ExtractUserIdFromAT)
  async getCommentByCommentId(
    @Param('id') commentId: string,
    @CurrentUserId() userId: string | null,
  ): Promise<CommentViewType | string> {
    const comment = await this.commentsQweryRepository.getCommentByCommentId(
      commentId,
      userId,
    );
    if (!comment)
      throw new NotFoundException('Comment with this id does not exist');
    return comment;
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(204)
  async updateCommentByCommentId(
    @Param('id') commentId: string,
    @Body() commentInputDto: commentInputDtoPipe,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    await this.commentService.updateCommentById(
      commentId,
      commentInputDto,
      userId,
    );
    return;
  }

  @Put(':id/like-status')
  @UseGuards(AccessTokenGuard)
  @HttpCode(204)
  async updateCommentStatusById(
    @Param('id') commentId: string,
    @CurrentUserId() userId: string,
    @Body() statusDto: StatusPipe,
  ): Promise<void> {
    await this.commentService.generateCommentStatusById(
      commentId,
      userId,
      statusDto,
    );
    return;
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @HttpCode(204)
  async deleteCommentById(
    @Param('id') commentId: string,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    await this.commentService.deleteCommentById(commentId, userId);
    return;
  }
}
