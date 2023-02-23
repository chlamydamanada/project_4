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
import { BlogsService } from '../../application/blogs.service';
import { BlogsQweryRepository } from '../qweryRepositories/blogsQwery.repository';
import { postsViewType } from '../../../posts/postsTypes/postsViewType';
import { postViewType } from '../../../posts/postsTypes/postViewType';
import { postQueryType } from '../../../posts/postsTypes/postsQweryType';
import { blogInputModelPipe } from '../pipes/blogInputDtoPipe';
import { BasicAuthGuard } from '../../../auth/guards/auth-guard';
import { BlogQweryPipe } from '../pipes/blogQweryPipe';
import { CurrentUserId } from '../../../../helpers/decorators/currentUserId.decorator';
import { ExtractUserIdFromAT } from '../../../auth/guards/extractUserIdFromAT.guard';
import { PostsService } from '../../../posts/application/posts.service';
import { PostsQweryRepository } from '../../../posts/api/qweryRepositories/postsQwery.repository';
import { blogPostInputModelPipe } from '../../../posts/api/pipes/postInputDtoPipe';
import { PostQweryPipe } from '../../../posts/api/pipes/postQweryPipe';
import { blogViewType } from '../../types/blogViewType';
import { blogsViewType } from '../../types/blogsViewType';
import { blogQueryType } from '../../types/blogsQweryType';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly blogsQweryRepository: BlogsQweryRepository,
    private readonly postsQweryRepository: PostsQweryRepository,
  ) {}

  @Get()
  async getAllBlogs(
    @Query() query: BlogQweryPipe,
  ): Promise<blogsViewType | string> {
    const blogs = await this.blogsQweryRepository.getAllBlogs(
      query as blogQueryType,
    );
    return blogs;
  }

  @Get(':id')
  async getBlogByBlogId(
    @Param('id')
    blogId: string,
  ): Promise<blogViewType | string | void> {
    //try {
    const blog = await this.blogsQweryRepository.getBlogByBlogId(blogId);
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    return blog;
  }

  @Get(':blogId/posts')
  @UseGuards(ExtractUserIdFromAT)
  async getAllPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: PostQweryPipe,
    @CurrentUserId() userId: string | null,
  ): Promise<postsViewType | string> {
    const blog = await this.blogsQweryRepository.getBlogByBlogId(blogId);
    if (!blog) throw new NotFoundException('Blog with this id does not exist');

    const posts = await this.postsQweryRepository.getAllPostsByBlogId(
      blogId,
      query as postQueryType,
      userId,
    );
    if (!posts)
      throw new NotFoundException('Posts of blog with this id do not exist');
    return posts;
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createBlog(
    @Body() blogInputModel: blogInputModelPipe,
  ): Promise<blogViewType | string> {
    const newBlogId = await this.blogsService.createBlog(blogInputModel);
    const newBlog = await this.blogsQweryRepository.getBlogByBlogId(newBlogId);
    return newBlog!;
  }

  @Post(':blogId/posts')
  @UseGuards(BasicAuthGuard)
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() postInputModel: blogPostInputModelPipe,
  ): Promise<postViewType | string> {
    const newPostId = await this.postsService.createPost({
      ...postInputModel,
      blogId,
    });
    const newPost = await this.postsQweryRepository.getPostByPostId(newPostId);
    return newPost!;
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async updateBlog(
    @Param('id') blogId: string,
    @Body() blogInputModel: blogInputModelPipe,
  ): Promise<string | void> {
    const isBlog = await this.blogsService.updateBlog(
      blogId,
      blogInputModel.name,
      blogInputModel.description,
      blogInputModel.websiteUrl,
    );
    if (!isBlog)
      throw new NotFoundException('Blog with this id does not exist');
    return;
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deleteBlogByBlogId(@Param('id') blogId: string): Promise<void> {
    const isBlog = await this.blogsQweryRepository.getBlogByBlogId(blogId);
    if (!isBlog)
      throw new NotFoundException('Blog with this id does not exist');
    await this.blogsService.deleteBlogByBlogId(blogId);
    return;
  }
}
