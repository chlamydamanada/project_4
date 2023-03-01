import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../../auth/guards/accessTokenAuth.guard';
import { BlogsQweryRepository } from '../../blogs/api/qweryRepositories/blogsQwery.repository';
import { PostsQweryRepository } from './qweryRepositories/postsQwery.repository';
import { ExtractUserIdFromAT } from '../../auth/guards/extractUserIdFromAT.guard';
import { commentQueryType } from '../../comments/commentsTypes/commentQweryType';
import { PostQweryPipe } from './pipes/postQweryPipe';
import { commentInputDtoPipe } from '../../comments/api/pipes/commentInputDtoPipe';
import { CommentViewType } from '../../comments/commentsTypes/commentViewType';
import { CurrentUserId } from '../../../../../helpers/decorators/currentUserId.decorator';
import { CommentsQweryRepository } from '../../comments/api/qweryRepositories/commentsQwery.repository';
import { StatusPipe } from '../../status/api/pipes/statusPipe';
import { CommentsViewType } from '../../comments/commentsTypes/commentsViewType';
import { postViewType } from '../types/postViewType';
import { postQueryType } from '../types/postsQweryType';
import { CommentQweryPipe } from '../../comments/api/pipes/commentQweryPipe';
import { CurrentUserInfo } from '../../../../../helpers/decorators/currentUserIdAndLogin';
import { UserInfoType } from '../../auth/types/userInfoType';
import { CommandBus } from '@nestjs/cqrs';
import { GeneratePostLikeStatusCommand } from '../useCases/generatePostLikeStatus.useCase';
import { CreateCommentCommand } from '../useCases/createComment.useCase';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly blogsQweryRepository: BlogsQweryRepository,
    private readonly postsQweryRepository: PostsQweryRepository,
    private readonly commentsQweryRepository: CommentsQweryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @UseGuards(ExtractUserIdFromAT)
  async getAllPosts(
    @Query() query: PostQweryPipe,
    @CurrentUserId() userId: string | null,
  ) {
    const posts = await this.postsQweryRepository.getAllPosts(
      query as postQueryType,
      userId,
    );
    return posts;
  }

  @Get(':id')
  @UseGuards(ExtractUserIdFromAT)
  async getPostByPostId(
    @Param('id') postId: string,
    @CurrentUserId() userId: string | null,
  ): Promise<postViewType | string | number> {
    const post = await this.postsQweryRepository.getPostByPostId(
      postId,
      userId,
    );
    if (!post) throw new NotFoundException('Post with this id does not exist');
    return post;
  }

  @Get(':postId/comments')
  @UseGuards(ExtractUserIdFromAT)
  async getAllCommentsByPostId(
    @Param('postId') postId: string,
    @Query() query: CommentQweryPipe,
    @CurrentUserId() userId: string | null,
  ): Promise<CommentsViewType | string> {
    const post = await this.postsQweryRepository.getPostByPostId(postId);
    if (!post) throw new NotFoundException('Post with this id does not exist');
    const allComments = await this.commentsQweryRepository.getAllComments(
      postId,
      query as commentQueryType,
      userId,
    );
    return allComments;
  }

  @Post(':postId/comments')
  @UseGuards(AccessTokenGuard)
  async createCommentByPostId(
    @Param('postId') postId: string,
    @Body() commentInputDto: commentInputDtoPipe,
    @CurrentUserId() userId: string,
  ): Promise<CommentViewType> {
    const commentId = await this.commandBus.execute(
      new CreateCommentCommand(postId, commentInputDto, userId),
    );
    const comment = await this.commentsQweryRepository.getCommentByCommentId(
      commentId,
    );
    return comment!;
  }

  @Put(':id/like-status')
  @UseGuards(AccessTokenGuard)
  @HttpCode(204)
  async updatePostStatusById(
    @Param('id') postId: string,
    @CurrentUserInfo() userInfo: UserInfoType,
    @Body() statusDto: StatusPipe,
  ): Promise<void> {
    await this.commandBus.execute(
      new GeneratePostLikeStatusCommand(postId, userInfo, statusDto),
    );
    return;
  }
}
