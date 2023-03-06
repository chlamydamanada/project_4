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
import { UsersQueryRepository } from './users/api/qweryRepositories/usersQwery.repository';
import { BasicAuthGuard } from '../public/auth/guards/auth-guard';
import { BlogQweryPipe } from '../public/blogs/api/pipes/blogQweryPipe';
import { blogsViewType } from '../public/blogs/types/blogsViewType';
import { blogQueryType } from '../public/blogs/types/blogsQweryType';
import { UserQweryPipe } from './users/api/pipes/userQweryPipe';
import { UsersViewType } from './users/usersTypes/usersViewType';
import { userInputModelPipe } from './users/api/pipes/userInputDtoPipe';
import { BanStatusInputModelPipe } from './users/api/pipes/banStatusInputModelPipe';
import { CommandBus } from '@nestjs/cqrs';
import { BlogBindToUserCommand } from './blogs/useCases/blogBindToUser.useCase';
import { DeleteUserCommand } from './users/useCases/deleteUser.useCase';
import { BanOrUnbanUserCommand } from './users/useCases/banOrUnbanUser.useCase';
import { CreateUserCommand } from './users/useCases/createUser.useCase';
import { BanOrUnbanBlogPipe } from './blogs/api/pipes/banOrUnbanBlog.pipe';
import { BanOrUnbanBlogCommand } from './blogs/useCases/banOrUnbanBlog.useCase';

@UseGuards(BasicAuthGuard)
@Controller('sa')
export class SaController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get('blogs')
  async getAllBlogs(@Query() query: BlogQweryPipe): Promise<blogsViewType> {
    const blogs = await this.blogsQueryRepository.getAllBlogsBySA(
      query as blogQueryType,
    );
    if (!blogs) throw new NotFoundException('No blogs found');
    return blogs;
  }

  @Put('blogs/:id/bind-with-user/:userId')
  @HttpCode(204)
  async blogBindToUser(
    @Param('id') blogId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.commandBus.execute(new BlogBindToUserCommand(blogId, userId));
    return;
  }

  @Get('users')
  async getAllUsers(
    @Query() query: UserQweryPipe,
  ): Promise<UsersViewType | string> {
    const users = await this.usersQueryRepository.getAllUsers(query);
    return users;
  }

  @Post('users')
  async createUser(@Body() userInputModel: userInputModelPipe) {
    const newUserId = await this.commandBus.execute(
      new CreateUserCommand(userInputModel),
    );
    const newUser = await this.usersQueryRepository.getUserByUserId(newUserId);
    return newUser!;
  }

  @Delete('users/:id')
  @HttpCode(204)
  async deleteUserByUserId(
    @Param('id') userId: string,
  ): Promise<void | string> {
    await this.commandBus.execute(new DeleteUserCommand(userId));
    return;
  }

  @Put('users/:id/ban')
  @HttpCode(204)
  async banOrUnbanUser(
    @Param('id') userId: string,
    @Body() banStatusInputModel: BanStatusInputModelPipe,
  ) {
    await this.commandBus.execute(
      new BanOrUnbanUserCommand({ userId, ...banStatusInputModel }),
    );
    return;
  }

  @Put('blogs/:id/ban')
  @HttpCode(204)
  async banOrUnbanBlog(
    @Param('id') blogId: string,
    @Body() banStatusInputModel: BanOrUnbanBlogPipe,
  ) {
    await this.commandBus.execute(
      new BanOrUnbanBlogCommand({ blogId, ...banStatusInputModel }),
    );
    return;
  }
}
