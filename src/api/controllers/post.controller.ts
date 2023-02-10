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
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../../application/posts.service';
import { PostsQweryRepository } from '../repositoriesQwery/postsQwery.repository';
import { postQueryType } from '../../types/postsTypes/postsQweryType';
import { postViewType } from '../../types/postsTypes/postViewType';
import { CommentsQweryRepository } from '../repositoriesQwery/commentsQwery.repository';
import { CommentsViewType } from '../../types/commentsTypes/commentsViewType';
import { postInputModelWithBlogIdType } from '../../types/postsTypes/postInputModelWithBlogIdType';
import { BlogsQweryRepository } from '../repositoriesQwery/blogsQwery.repository';
import { Response } from 'express';
import { postInputModelIdPipe } from '../pipes/posts/postInputDtoPipe';
import { BasicAuthGuard } from '../guards/auth-guard';
import { PostQweryPipe } from '../pipes/posts/postQweryPipe';
import { CommentQweryPipe } from '../pipes/comments/commentQweryPipe';
import { commentQueryType } from '../../types/commentsTypes/commentQweryType';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly blogsQweryRepository: BlogsQweryRepository,
    private readonly postsQweryRepository: PostsQweryRepository,
    private readonly commentsQweryRepository: CommentsQweryRepository,
  ) {}
  @Get()
  async getAllPosts(@Query() query: PostQweryPipe) {
    const posts = await this.postsQweryRepository.getAllPosts(
      query as postQueryType,
    );
    return posts;
  }

  @Get(':id')
  async getPostByPostId(
    @Param('id') postId: string,
  ): Promise<postViewType | string | number> {
    const post = await this.postsQweryRepository.getPostByPostId(postId);
    if (!post) throw new NotFoundException('Post with this id does not exist');
    return post;
  }

  @Get(':postId/comments')
  async getAllCommentsByPostId(
    @Param('postId') postId: string,
    @Query() query: CommentQweryPipe,
  ): Promise<CommentsViewType | string> {
    const post = await this.postsQweryRepository.getPostByPostId(postId);
    if (!post) throw new NotFoundException('Post with this id does not exist');
    const allComments = await this.commentsQweryRepository.getAllComments(
      postId,
      query as commentQueryType,
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
