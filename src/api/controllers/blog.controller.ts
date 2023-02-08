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
} from '@nestjs/common';
import { BlogsService } from '../../application/blogs.service';
import { BlogsQweryRepository } from '../repositoriesQwery/blogsQwery.repository';
import { blogViewType } from '../../types/blogsTypes/blogViewType';
import { blogsViewType } from '../../types/blogsTypes/blogsViewType';
import { PostsQweryRepository } from '../repositoriesQwery/postsQwery.repository';
import { postsViewType } from '../../types/postsTypes/postsViewType';
import { blogQueryType } from '../../types/blogsTypes/blogsQweryType';
import { postInputModelType } from '../../types/postsTypes/postInputModelType';
import { postViewType } from '../../types/postsTypes/postViewType';
import { PostsService } from '../../application/posts.service';
import { postQueryType } from '../../types/postsTypes/postsQweryType';
import { blogInputModelPipe } from './pipes/blogInputDtoPipe';

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
    @Query() query: blogQueryType,
  ): Promise<blogsViewType | string> {
    try {
      const blogs = await this.blogsQweryRepository.getAllBlogs(query);
      return blogs;
    } catch (e) {
      return 'blogs/getAllBlogs' + e;
    }
  }

  @Get(':id')
  async getBlogByBlogId(
    @Param('id')
    blogId: string,
  ): Promise<blogViewType | string | void> {
    //try {
    const blog = await this.blogsQweryRepository.getBlogByBlogId(blogId);
    if (!blog) {
      throw new NotFoundException('Blog with this id does not exist');
      return;
    }

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
    @Query() query: postQueryType,
  ): Promise<postsViewType | string> {
    const blog = await this.blogsQweryRepository.getBlogByBlogId(blogId);
    if (!blog) throw new NotFoundException('Blog with this id does not exist');

    const posts = await this.postsQweryRepository.getAllPostsByBlogId(
      blogId,
      query,
    );
    return posts;
  }

  @Post()
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
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() postInputModel: postInputModelType,
  ): Promise<postViewType | string> {
    const blog = await this.blogsQweryRepository.getBlogByBlogId(blogId);
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    const newPostId = await this.postsService.createPost(
      postInputModel.title,
      postInputModel.shortDescription,
      postInputModel.content,
      blogId,
      blog.name,
    );
    const newPost = await this.postsQweryRepository.getPostByPostId(newPostId);
    return newPost!;
  }

  @Put(':id')
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
  @HttpCode(204)
  async deleteBlogByBlogId(@Param('id') blogId: string): Promise<void> {
    const isBlog = await this.blogsQweryRepository.getBlogByBlogId(blogId);
    if (!isBlog)
      throw new NotFoundException('Blog with this id does not exist');
    await this.blogsService.deleteBlogByBlogId(blogId);
    return;
  }
}
