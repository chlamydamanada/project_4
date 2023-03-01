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
import { BlogsQweryRepository } from '../public/blogs/api/qweryRepositories/blogsQwery.repository';
import { AccessTokenGuard } from '../public/auth/guards/accessTokenAuth.guard';
import { CurrentUserId } from '../../../helpers/decorators/currentUserId.decorator';
import { BlogQweryPipe } from '../public/blogs/api/pipes/blogQweryPipe';
import { blogQueryType } from '../public/blogs/types/blogsQweryType';
import { blogInputModelPipe } from './blogs/pipes/blogInputDtoPipe';
import { blogViewType } from '../public/blogs/types/blogViewType';
import { postInputModelIdPipe } from './posts/pipes/postInputDtoPipe';
import { postViewType } from '../public/posts/types/postViewType';
import { PostsQweryRepository } from '../public/posts/api/qweryRepositories/postsQwery.repository';
import { CurrentUserInfo } from '../../../helpers/decorators/currentUserIdAndLogin';
import { UserInfoType } from '../public/auth/types/userInfoType';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from './blogs/useCases/createBlog.useCase';
import { UpdateBlogCommand } from './blogs/useCases/updateBlog.useCase';
import { DeleteBlogCommand } from './blogs/useCases/deleteBlog.useCase';
import { CreatePostCommand } from './posts/useCases/createPost.useCase';
import { UpdatePostCommand } from './posts/useCases/updatePost.useCase';
import { DeletePostCommand } from './posts/useCases/deletePost.useCase';

@UseGuards(AccessTokenGuard)
@Controller('blogger/blogs')
export class BloggerController {
  constructor(
    private readonly blogsQweryRepository: BlogsQweryRepository,
    private readonly postsQweryRepository: PostsQweryRepository,
    private commandBus: CommandBus,
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
    @CurrentUserInfo() userInfo: UserInfoType,
  ): Promise<blogViewType | string> {
    const newBlogId: string = await this.commandBus.execute(
      new CreateBlogCommand({
        ...blogInputModel,
        bloggerId: userInfo.id,
        bloggerLogin: userInfo.login,
      }),
    );
    const newBlog = await this.blogsQweryRepository.getBlogByBlogId(newBlogId);
    return newBlog!;
  }

  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() postInputModel: postInputModelIdPipe,
    @CurrentUserId() bloggerId: string,
  ): Promise<postViewType | string> {
    const newPostId = await this.commandBus.execute(
      new CreatePostCommand({
        ...postInputModel,
        blogId,
        bloggerId,
      }),
    );
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
    await this.commandBus.execute(
      new UpdateBlogCommand({
        blogId,
        bloggerId,
        ...blogInputModel,
      }),
    );
    return;
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  async updatePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() postInputDto: postInputModelIdPipe,
    @CurrentUserId() bloggerId: string,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdatePostCommand({
        ...postInputDto,
        postId,
        blogId,
        bloggerId,
      }),
    );
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlogByBlogId(
    @Param('id') blogId: string,
    @CurrentUserId() bloggerId: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteBlogCommand(blogId, bloggerId));
    return;
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async deletePostByPostId(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @CurrentUserId() bloggerId: string,
  ): Promise<string | void> {
    await this.commandBus.execute(
      new DeletePostCommand({ postId, blogId, bloggerId }),
    );
    return;
  }
}
