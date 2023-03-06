import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { BanStatusByBloggerDtoType } from '../types/banStatusByBloggerDtoType';
import { UsersForBloggerRepository } from '../repositories/usersForBlogger.repositoryMongo';

export class BanOrUnbanUserByBloggerCommand {
  constructor(public banStatusDto: BanStatusByBloggerDtoType) {}
}

@CommandHandler(BanOrUnbanUserByBloggerCommand)
export class BanOrUnbanUserByBloggerUseCase
  implements ICommandHandler<BanOrUnbanUserByBloggerCommand>
{
  constructor(
    private readonly usersRepository: UsersForBloggerRepository,
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

    if (command.banStatusDto.isBanned) {
      const banStatus = await this.usersRepository.getBanStatusEntity();
      banStatus.createBanStatus(
        command.banStatusDto.bloggerId,
        command.banStatusDto.blogId,
        command.banStatusDto.banReason,
        command.banStatusDto.userId,
        user.login,
      );
      await this.usersRepository.banUserByBlogger(banStatus);
    }
    await this.usersRepository.unbanUserByBlogger(
      command.banStatusDto.userId,
      command.banStatusDto.blogId,
    );

    return;
  }
}
