import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepository } from './qweryRepositories/blogs-query-repository.service';
import { postsViewType } from '../../posts/types/postsViewType';
import { postQueryType } from '../../posts/types/postsQweryType';
import { BlogQweryPipe } from './pipes/blogQweryPipe';
import { CurrentUserId } from '../../../../../helpers/decorators/currentUserId.decorator';
import { ExtractUserIdFromAT } from '../../auth/guards/extractUserIdFromAT.guard';
import { PostsQueryRepository } from '../../posts/api/qweryRepositories/posts-query-repository.service';
import { PostQweryPipe } from '../../posts/api/pipes/postQweryPipe';
import { blogViewType } from '../types/blogViewType';
import { blogsViewType } from '../types/blogsViewType';
import { blogQueryType } from '../types/blogsQweryType';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQweryRepository: BlogsQueryRepository,
    private readonly postsQweryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getAllBlogs(@Query() query: BlogQweryPipe): Promise<blogsViewType> {
    const blogs = await this.blogsQweryRepository.getAllBlogs(
      query as blogQueryType,
    );
    if (!blogs) throw new NotFoundException('No blogs found');
    return blogs;
  }

  @Get(':id')
  async getBlogByBlogId(
    @Param('id')
    blogId: string,
  ): Promise<blogViewType> {
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
}
