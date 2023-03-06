import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../users/repositories/users.repository';
import { BlogsRepository } from '../../../blogger/blogs/repositories/blogs.repository';
import { BlogBanStatusDtoType } from '../../users/usersTypes/blogBanStatusDtoType';
import { NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../../../blogger/posts/repositories/posts.repository';

export class BanOrUnbanBlogCommand {
  constructor(public banStatusDto: BlogBanStatusDtoType) {}
}
@CommandHandler(BanOrUnbanBlogCommand)
export class BanOrUnbanBlogUseCase
  implements ICommandHandler<BanOrUnbanBlogCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}
  async execute(command: BanOrUnbanBlogCommand) {
    const blog = await this.blogsRepository.findBlogById(
      command.banStatusDto.blogId,
    );
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    //ban or unban blog
    blog.banOrUnbanBlog(command.banStatusDto.isBanned);
    await this.blogsRepository.saveBlog(blog);
    //ban or unban posts
    await this.postsRepository.banOrUnbanPostsForBlog(
      command.banStatusDto.blogId,
      command.banStatusDto.isBanned,
    );
    return;
  }
}
