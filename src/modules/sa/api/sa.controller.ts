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
import { BlogsQweryRepository } from '../../blogs/api/qweryRepositories/blogsQwery.repository';
import { UsersService } from '../../users/application/users.service';
import { UsersQueryRepository } from '../../users/api/qweryRepositories/usersQwery.repository';
import { BasicAuthGuard } from '../../auth/guards/auth-guard';
import { BlogQweryPipe } from '../../blogs/api/pipes/blogQweryPipe';
import { blogsViewType } from '../../blogs/types/blogsViewType';
import { blogQueryType } from '../../blogs/types/blogsQweryType';
import { UserQweryPipe } from '../../users/api/pipes/userQweryPipe';
import { UsersViewType } from '../../users/usersTypes/usersViewType';
import { userInputModelPipe } from '../../users/api/pipes/userInputDtoPipe';
import { BanStatusInputModelPipe } from '../../users/usersTypes/banStatusInputModelPipe';

@UseGuards(BasicAuthGuard)
@Controller('sa')
export class SaController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQweryRepository,
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
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
    await this.blogsService.blogBindToUser(blogId, userId);
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
    const newUserId = await this.usersService.createUser(userInputModel);
    const newUser = await this.usersQueryRepository.getUserByUserId(newUserId);
    return newUser!;
  }

  @Delete('users/:id')
  @HttpCode(204)
  async deleteUserByUserId(
    @Param('id') userId: string,
  ): Promise<void | string> {
    await this.usersService.deleteUserById(userId);
    return;
  }

  @Put('users/:id/ban')
  @HttpCode(204)
  async banOrUnbanUser(
    @Param('id') userId: string,
    @Body() banStatusInputModel: BanStatusInputModelPipe,
  ) {
    await this.usersService.updateBanStatus({ userId, ...banStatusInputModel });
    return;
  }
}
