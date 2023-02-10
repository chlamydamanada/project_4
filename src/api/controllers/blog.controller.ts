import {
  Body,
  CanActivate,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../../application/blogs.service';
import { BlogsQweryRepository } from '../repositoriesQwery/blogsQwery.repository';
import { blogViewType } from '../../types/blogsTypes/blogViewType';
import { blogsViewType } from '../../types/blogsTypes/blogsViewType';
import { PostsQweryRepository } from '../repositoriesQwery/postsQwery.repository';
import { postsViewType } from '../../types/postsTypes/postsViewType';
import { blogQueryType } from '../../types/blogsTypes/blogsQweryType';
import { postViewType } from '../../types/postsTypes/postViewType';
import { PostsService } from '../../application/posts.service';
import { postQueryType } from '../../types/postsTypes/postsQweryType';
import { blogInputModelPipe } from '../pipes/blogs/blogInputDtoPipe';
import { blogPostInputModelPipe } from '../pipes/posts/postInputDtoPipe';
import { BasicAuthGuard } from '../guards/auth-guard';
import { BlogQweryPipe } from '../pipes/blogs/blogQweryPipe';
import { PostQweryPipe } from '../pipes/posts/postQweryPipe';

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
    console.log('+++++', query);
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
    //} catch (e: unknown) {
    //  if (e instanceof Error) {
    //    if (e.message === 'Blog with this id does not exist')
    //      throw new NotFoundException('Blog with this id does not exist');
    // }
    // return;
    //}
  }

  @Get(':blogId/posts')
  async getAllPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: PostQweryPipe,
  ): Promise<postsViewType | string> {
    const blog = await this.blogsQweryRepository.getBlogByBlogId(blogId);
    if (!blog) throw new NotFoundException('Blog with this id does not exist');

    const posts = await this.postsQweryRepository.getAllPostsByBlogId(
      blogId,
      query as postQueryType,
    );
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
    // } catch (e: unknown) {
    //if (e instanceof Error) {
    //if (e.message === 'Bad Request') throw new NotFoundException();
    // }
    // return 'blogs/createBlog ' + e;
    //}
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
