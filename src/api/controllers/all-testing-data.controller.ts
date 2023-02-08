import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsService } from '../../application/blogs.service';
import { PostsService } from '../../application/posts.service';
import { UsersService } from '../../application/users.service';
import { CommentsRepository } from '../../repositories/comments.repository';

@Controller('testing/all-data')
export class AllTestingDataController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly commentsRepository: CommentsRepository,
  ) {}
  @Delete()
  @HttpCode(204)
  async deleteAllData(): Promise<string | void> {
    await Promise.all([
      this.blogsService.deleteAllBlogs(),
      this.postsService.deleteAllPosts(),
      this.usersService.deleteAllUsers(),
      this.commentsRepository.deleteAllComments(),
    ]);
    return;
  }
}
