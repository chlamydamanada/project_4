import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../../application/posts.service';
import { PostsQweryRepository } from '../repositoriesQwery/postsQwery.repository';
import { postQueryType } from '../../types/postsTypes/postsQweryType';
import { postViewType } from '../../types/postsTypes/postViewType';
import { CommentsQweryRepository } from '../repositoriesQwery/commentsQwery.repository';
import { CommentsViewType } from '../../types/commentsTypes/commentsViewType';
import { BlogsQweryRepository } from '../repositoriesQwery/blogsQwery.repository';
import { postInputModelIdPipe } from '../pipes/posts/postInputDtoPipe';
import { BasicAuthGuard } from '../../auth/guards/auth-guard';
import { PostQweryPipe } from '../pipes/posts/postQweryPipe';
import { CommentQweryPipe } from '../pipes/comments/commentQweryPipe';
import { commentQueryType } from '../../types/commentsTypes/commentQweryType';
import { AccessTokenGuard } from '../../auth/guards/accessTokenAuth.guard';
import { commentInputDtoPipe } from '../pipes/comments/commentInputDtoPipe';
import { CurrentUserId } from '../../helpers/decorators/currentUserId.decorator';
import { CommentService } from '../../application/comments.service';
import { CommentViewType } from '../../types/commentsTypes/commentViewType';
import { StatusPipe } from '../pipes/status/statusPipe';
import { ExtractUserIdFromAT } from '../../auth/guards/extractUserIdFromAT.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentService: CommentService,
    private readonly blogsQweryRepository: BlogsQweryRepository,
    private readonly postsQweryRepository: PostsQweryRepository,
    private readonly commentsQweryRepository: CommentsQweryRepository,
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

  @Post()
  @UseGuards(BasicAuthGuard)
  async createPost(
    @Body() postInputModel: postInputModelIdPipe,
  ): Promise<postViewType | string | number> {
    const newPostId = await this.postsService.createPost(postInputModel);
    const newPost = await this.postsQweryRepository.getPostByPostId(newPostId);
    return newPost!;
  }

  @Post(':postId/comments')
  @UseGuards(AccessTokenGuard)
  async createCommentByPostId(
    @Param('postId') postId: string,
    @Body() commentInputDto: commentInputDtoPipe,
    @CurrentUserId() userId: string,
  ): Promise<CommentViewType> {
    const commentId = await this.commentService.createCommentByPostId(
      postId,
      commentInputDto,
      userId,
    );
    const comment = await this.commentsQweryRepository.getCommentByCommentId(
      commentId,
    );
    return comment!;
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async updatePost(
    @Param('id') postId: string,
    @Body() postInputDto: postInputModelIdPipe,
  ): Promise<void> {
    await this.postsService.updatePost(postInputDto, postId);
    return;
  }

  @Put(':id/like-status')
  @UseGuards(AccessTokenGuard)
  @HttpCode(204)
  async updatePostStatusById(
    @Param('id') postId: string,
    @CurrentUserId() userId: string,
    @Body() statusDto: StatusPipe,
  ): Promise<void> {
    await this.postsService.generatePostStatusById(postId, userId, statusDto);
    return;
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deletePostByPostId(
    @Param('id') postId: string,
  ): Promise<string | void> {
    const post = await this.postsQweryRepository.getPostByPostId(postId);
    if (!post) throw new NotFoundException('Post with this id does not exist');
    await this.postsService.deletePostByPostId(postId);
    return;
  }
}
