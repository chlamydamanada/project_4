import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogsService } from '../../../blogs/application/blogs.service';
import { PostsService } from '../../../posts/application/posts.service';
import { UsersService } from '../../../users/application/users.service';
import { CommentService } from '../../../comments/application/comments.service';

@Controller('testing/all-data')
export class AllTestingDataController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly commentsService: CommentService,
  ) {}
  @Delete()
  @HttpCode(204)
  async deleteAllData(): Promise<string | void> {
    await Promise.all([
      this.blogsService.deleteAllBlogs(),
      this.postsService.deleteAllPosts(),
      this.usersService.deleteAllUsers(),
      this.commentsService.deleteAllComments(),
    ]);

    return;
  }
}
