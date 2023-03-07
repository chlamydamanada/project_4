import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { BanStatusByBloggerDtoType } from '../types/banStatusByBloggerDtoType';
import { UsersRepository } from '../../../superAdmin/users/repositories/users.repository';

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
  ) {}
  async execute(command: BanOrUnbanUserByBloggerCommand): Promise<void> {
    // check does the user exist
    const user = await this.usersRepository.findUserById(
      command.banStatusDto.userId,
    );
    if (!user) throw new NotFoundException('User with this id does not exist');
    //check does the blog exist
    const blog = await this.blogsRepository.findBlogById(
      command.banStatusDto.blogId,
    );
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    //check is blogger owner of this blog
    if (blog.ownerId !== command.banStatusDto.bloggerId)
      throw new ForbiddenException('You can`t ban user for this blog');
    // ban user for specific blog

    if (command.banStatusDto.isBanned) {
      // create user and ban info
      const bannedUser = {
        id: user._id,
        login: user.login,
        isBanned: true,
        banDate: new Date().toISOString(),
        banReason: command.banStatusDto.banReason,
      };
      //ban user
      blog.addBannedUserForBlog(bannedUser);
      await this.blogsRepository.saveBlog(blog);
    }
    //unban user for specific blog
    blog.deleteBannedUserFormBlog(command.banStatusDto.userId);
    await this.blogsRepository.saveBlog(blog);
    return;
  }
}
