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
import { BlogsQueryRepository } from '../public/blogs/api/qweryRepositories/blogs-query-repository.service';
import { AccessTokenGuard } from '../public/auth/guards/accessTokenAuth.guard';
import { CurrentUserId } from '../../../helpers/decorators/currentUserId.decorator';
import { BlogQweryPipe } from '../public/blogs/api/pipes/blogQweryPipe';
import { blogQueryType } from '../public/blogs/types/blogsQweryType';
import { blogInputModelPipe } from './blogs/pipes/blogInputDtoPipe';
import { blogViewType } from '../public/blogs/types/blogViewType';
import { postInputModelIdPipe } from './posts/pipes/postInputDtoPipe';
import { postViewType } from '../public/posts/types/postViewType';
import { PostsQueryRepository } from '../public/posts/api/qweryRepositories/posts-query-repository.service';
import { CurrentUserInfo } from '../../../helpers/decorators/currentUserIdAndLogin';
import { UserInfoType } from '../public/auth/types/userInfoType';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from './blogs/useCases/createBlog.useCase';
import { UpdateBlogCommand } from './blogs/useCases/updateBlog.useCase';
import { DeleteBlogCommand } from './blogs/useCases/deleteBlog.useCase';
import { CreatePostCommand } from './posts/useCases/createPost.useCase';
import { UpdatePostCommand } from './posts/useCases/updatePost.useCase';
import { DeletePostCommand } from './posts/useCases/deletePost.useCase';
import { BloggerQueryRepository } from './bloggerQueryRepository';
import { CommentQueryPipe } from '../public/comments/api/pipes/commentQueryPipe';
import { commentQueryType } from '../public/comments/commentsTypes/commentQweryType';
import { CommentsViewForBloggerType } from './comments/types/commentsViewForBloggerType';
import { BanStatusByBloggerPipe } from './users/api/pipes/banStatusByBloggerPipe';
import { BanOrUnbanUserByBloggerCommand } from './users/useCases/banOrUnbanUserByBlogger.useCase';
import { BannedUserQueryDtoPipe } from './users/api/pipes/bannedUserQueryDtoPipe';
import { BannedUsersForBlogType } from './users/types/bannedUsersForBlogType';

@UseGuards(AccessTokenGuard)
@Controller('blogger')
export class BloggerController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly bloggerQueryRepository: BloggerQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get('blogs')
  async getAllOwnerBlogs(
    @CurrentUserId() bloggerId: string,
    @Query() query: BlogQweryPipe,
  ) {
    const blogs = await this.blogsQueryRepository.getAllBlogs(
      query as blogQueryType,
      bloggerId,
    );
    if (!blogs) throw new NotFoundException('You have`t any blog');
    return blogs;
  }

  @Get('blogs/comments')
  async getAllCommentsForAllPost(
    @CurrentUserId() bloggerId: string,
    @Query() query: CommentQueryPipe,
  ): Promise<CommentsViewForBloggerType> {
    const comments =
      await this.bloggerQueryRepository.findAllCommentsForAllPosts(
        bloggerId,
        query as commentQueryType,
      );
    if (!comments) throw new NotFoundException('You have`t any comments');
    return comments;
  }

  @Post('blogs')
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
    const newBlog = await this.blogsQueryRepository.getBlogByBlogId(newBlogId);
    return newBlog!;
  }

  @Post('blogs/:blogId/posts')
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
    const newPost = await this.postsQueryRepository.getPostByPostId(newPostId);
    return newPost!;
  }

  @Put('blogs/:id')
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

  @Put('blogs/:blogId/posts/:postId')
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

  @Delete('blogs/:id')
  @HttpCode(204)
  async deleteBlogByBlogId(
    @Param('id') blogId: string,
    @CurrentUserId() bloggerId: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteBlogCommand(blogId, bloggerId));
    return;
  }

  @Delete('blogs/:blogId/posts/:postId')
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

  @Put('users/:userId/ban')
  @HttpCode(204)
  async banOrUnbanUser(
    @Param('userId') userId: string,
    @CurrentUserId() bloggerId: string,
    @Body() banUserInputDto: BanStatusByBloggerPipe,
  ) {
    await this.commandBus.execute(
      new BanOrUnbanUserByBloggerCommand({
        userId,
        bloggerId,
        ...banUserInputDto,
      }),
    );
    return;
  }

  @Get('users/blog/:blogId')
  async getBannedUsersForBlog(
    @Param('blogId') blogId: string,
    @Query() query: BannedUserQueryDtoPipe,
  ): Promise<BannedUsersForBlogType> {
    const bannedUsers = await this.bloggerQueryRepository.findBannedUserForBlog(
      blogId,
      query,
    );
    if (!bannedUsers) throw new NotFoundException('You haven`t banned users');
    return bannedUsers;
  }
}
