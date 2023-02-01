import { Controller, Delete } from '@nestjs/common';
import { BlogsService } from '../../application/blogs.service';
import { PostsService } from '../../application/posts.service';
import { UsersService } from '../../application/users.service';

@Controller('testing/all-data')
export class AllTestingDataController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}
  @Delete()
  async deleteAllData(): Promise<string> {
    try {
      await Promise.all([
        this.blogsService.deleteAllBlogs(),
        this.postsService.deleteAllPosts(),
        this.usersService.deleteAllUsers(),
      ]);
      return;
    } catch (e) {
      return 'deleteAllData' + e;
    }
  }
}
