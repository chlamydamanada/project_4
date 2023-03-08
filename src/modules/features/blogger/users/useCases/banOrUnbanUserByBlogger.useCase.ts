import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { BanStatusByBloggerDtoType } from '../types/banStatusByBloggerDtoType';
import { UsersRepository } from '../../../superAdmin/users/repositories/users.repository';
import { UsersForBloggerRepository } from '../repositories/usersForBlogger.repositoryMongo';

export class BanOrUnbanUserByBloggerCommand {
  constructor(public banStatusDto: BanStatusByBloggerDtoType) {}
}

@CommandHandler(BanOrUnbanUserByBloggerCommand)
export class BanOrUnbanUserByBloggerUseCase
  implements ICommandHandler<BanOrUnbanUserByBloggerCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly usersForBloggerRepository: UsersForBloggerRepository,
  ) {}
  async execute(command: BanOrUnbanUserByBloggerCommand): Promise<void> {
    // check does the user exist
    if (command.banStatusDto.userId === command.banStatusDto.bloggerId)
      throw new ForbiddenException('You try to ban yourself');
    const user = await this.usersRepository.findUserById(
      command.banStatusDto.userId,
    );
    if (!user) throw new NotFoundException('User with this id does not exist');
    // check does the blog exist
    const blog = await this.blogsRepository.findBlogById(
      command.banStatusDto.blogId,
    );
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    //check is blogger owner of this blog
    if (blog.ownerId !== command.banStatusDto.bloggerId)
      throw new ForbiddenException('You can`t ban user for this blog');
    // check user should be banned or unbanned
    if (command.banStatusDto.isBanned) {
      // ban user for specific blog
      await blog.addBannedUserForBlog({
        id: command.banStatusDto.userId,
        login: user.login,

        isBanned: true,
        banDate: new Date().toISOString(),
        banReason: command.banStatusDto.banReason,
      });
      console.log('isBlog.bannedUsers', blog.bannedUsers);
      await this.blogsRepository.saveBlog(blog);
      return;
    }
    //unban user for specific blog
    blog.deleteBannedUserFormBlog(command.banStatusDto.userId);
    await this.blogsRepository.saveBlog(blog);
    return;
  }
}
