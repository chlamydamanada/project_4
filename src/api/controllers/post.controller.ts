import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from '../../application/posts.service';
import { PostsQweryRepository } from '../repositoriesQwery/postsQwery.repository';
import { postQueryType } from '../../types/postsTypes/postsQweryType';
import { postViewType } from '../../types/postsTypes/postViewType';
import { CommentsQweryRepository } from '../repositoriesQwery/commentsQwery.repository';
import { CommentsViewType } from '../../types/commentsTypes/commentsViewType';
import { postInputModelWithBlogIdType } from '../../types/postsTypes/postInputModelWithBlogIdType';
import { BlogsQweryRepository } from '../repositoriesQwery/blogsQwery.repository';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly blogsQweryRepository: BlogsQweryRepository,
    private readonly postsQweryRepository: PostsQweryRepository,
    private readonly commentsQweryRepository: CommentsQweryRepository,
  ) {}
  @Get()
  async getAllPosts(@Query() query: postQueryType) {
    try {
      const posts = await this.postsQweryRepository.getAllPosts(query);
      return posts;
    } catch (e) {
      return 'posts/getAllPosts' + e;
    }
  }

  @Get(':id')
  async getPostByPostId(
    @Param('id') postId: string,
  ): Promise<postViewType | string> {
    try {
      const post = await this.postsQweryRepository.getPostByPostId(postId);
      return post;
    } catch (e) {
      return 'posts/getPostByPostId' + e;
    }
  }

  @Get(':id')
  async getAllCommentsByPostId(
    @Param('id') postId: string,
    @Query() query: postQueryType,
  ): Promise<CommentsViewType | string> {
    try {
      const post = await this.postsQweryRepository.getPostByPostId(postId);
      if (!post) throw new Error('Post with this id does not exist');
      const allComments = await this.commentsQweryRepository.getAllComments(
        postId,
        query,
      );
      return allComments;
    } catch (e) {
      return 'posts/getAllCommentsByPostId' + e;
    }
  }
  @Post()
  async createPost(
    @Body() postInputModel: postInputModelWithBlogIdType,
  ): Promise<postViewType | string> {
    try {
      const blog = await this.blogsQweryRepository.getBlogByBlogId(
        postInputModel.blogId,
      );
      if (!blog) throw new Error('Blog with this id does not exist');
      const newPostId = await this.postsService.createPost(
        postInputModel.title,
        postInputModel.shortDescription,
        postInputModel.content,
        postInputModel.blogId,
        blog.name,
      );
      const newPost = await this.postsQweryRepository.getPostByPostId(
        newPostId,
      );
      return newPost;
    } catch (e) {
      return 'posts/createPost' + e;
    }
  }
  @Put(':id')
  async updatePost(
    @Param('id') postId: string,
    @Body() postInputModel: postInputModelWithBlogIdType,
  ): Promise<string> {
    try {
      const blog = await this.blogsQweryRepository.getBlogByBlogId(
        postInputModel.blogId,
      );
      if (!blog) throw new Error('Blog with this id does not exist');
      const isPost = await this.postsService.updatePost(
        postId,
        postInputModel.title,
        postInputModel.shortDescription,
        postInputModel.content,
        postInputModel.blogId,
        blog.name,
      );
      if (!isPost) {
        throw new Error('Post with this id does not exist');
      }
      return;
    } catch (e) {
      return 'posts/updatePost' + e;
    }
  }
  @Delete(':id')
  async deletePostByPostId(@Param('id') postId: string): Promise<string> {
    try {
      const post = await this.postsQweryRepository.getPostByPostId(postId);
      if (!post) throw new Error('Post with this id does not exist');
      await this.postsService.deletePostByPostId(postId);
      return;
    } catch (e) {
      return 'posts/deletePostByPostId' + e;
    }
  }
}
