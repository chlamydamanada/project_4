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
import { BlogsService } from '../../blogs/application/blogs.service';
import { PostsService } from '../../posts/application/posts.service';
import { BlogsQweryRepository } from '../../blogs/api/qweryRepositories/blogsQwery.repository';
import { AccessTokenGuard } from '../../auth/guards/accessTokenAuth.guard';
import { CurrentUserId } from '../../../helpers/decorators/currentUserId.decorator';
import { BlogQweryPipe } from '../../blogs/api/pipes/blogQweryPipe';
import { blogQueryType } from '../../blogs/types/blogsQweryType';
import { blogInputModelPipe } from '../../blogs/api/pipes/blogInputDtoPipe';
import { blogViewType } from '../../blogs/types/blogViewType';
import { BasicAuthGuard } from '../../auth/guards/auth-guard';
import { postInputModelIdPipe } from '../../posts/api/pipes/postInputDtoPipe';
import { postViewType } from '../../posts/postsTypes/postViewType';
import { PostsQweryRepository } from '../../posts/api/qweryRepositories/postsQwery.repository';

@UseGuards(AccessTokenGuard)
@Controller('blogger/blogs')
export class BloggerController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly blogsQweryRepository: BlogsQweryRepository,
    private readonly postsQweryRepository: PostsQweryRepository,
  ) {}

  @Get()
  async getAllOwnerBlogs(
    @CurrentUserId() bloggerId: string,
    @Query() query: BlogQweryPipe,
  ) {
    const blogs = await this.blogsQweryRepository.getAllBlogs(
      query as blogQueryType,
      bloggerId,
    );
    if (!blogs) throw new NotFoundException('You have`t any blog');
    return blogs;
  }

  @Post()
  async createBlog(
    @Body() blogInputModel: blogInputModelPipe,
    @CurrentUserId() bloggerId: string,
  ): Promise<blogViewType | string> {
    const newBlogId = await this.blogsService.createBlog({
      ...blogInputModel,
      bloggerId,
    });
    const newBlog = await this.blogsQweryRepository.getBlogByBlogId(newBlogId);
    return newBlog!;
  }

  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() postInputModel: postInputModelIdPipe,
    @CurrentUserId() bloggerId: string,
  ): Promise<postViewType | string> {
    const newPostId = await this.postsService.createPost({
      ...postInputModel,
      blogId,
      bloggerId,
    });
    const newPost = await this.postsQweryRepository.getPostByPostId(newPostId);
    return newPost!;
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') blogId: string,
    @Body() blogInputModel: blogInputModelPipe,
    @CurrentUserId() bloggerId: string,
  ): Promise<void> {
    await this.blogsService.updateBlog({
      blogId,
      bloggerId,
      ...blogInputModel,
    });
    return;
  }

  @Put(':blogId/posts/:postId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async updatePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() postInputDto: postInputModelIdPipe,
    @CurrentUserId() bloggerId: string,
  ): Promise<void> {
    await this.postsService.updatePost({
      ...postInputDto,
      postId,
      blogId,
      bloggerId,
    });
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlogByBlogId(
    @Param('id') blogId: string,
    @CurrentUserId() bloggerId: string,
  ): Promise<void> {
    await this.blogsService.deleteBlogByBlogId(blogId, bloggerId);
    return;
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async deletePostByPostId(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @CurrentUserId() bloggerId: string,
  ): Promise<string | void> {
    await this.postsService.deletePostByPostId({ postId, blogId, bloggerId });
    return;
  }
}
