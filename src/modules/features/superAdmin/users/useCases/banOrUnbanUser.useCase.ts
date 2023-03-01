import { UpdatingBanStatusDtoType } from '../usersTypes/updatingBanStatusDtoType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../repositories/users.repository';
import { DevicesRepository } from '../../../public/devices/repositories/device.repository';
import { CommentsRepository } from '../../../public/comments/repositories/comments.repository';
import { BlogsRepository } from '../../../blogger/blogs/repositories/blogs.repository';
import { PostsRepository } from '../../../blogger/posts/repositories/posts.repository';
import { NotFoundException } from '@nestjs/common';

export class BanOrUnbanUserCommand {
  constructor(public banStatusDto: UpdatingBanStatusDtoType) {}
}

@CommandHandler(BanOrUnbanUserCommand)
export class BanOrUnbanUserUseCase
  implements ICommandHandler<BanOrUnbanUserCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly devicesRepository: DevicesRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}
  async execute(command: BanOrUnbanUserCommand): Promise<void> {
    const user = await this.usersRepository.findUserById(
      command.banStatusDto.userId,
    );
    if (!user) throw new NotFoundException('User with this id does not exist');
    // ban or unban user
    user.banOrUnbanUser(command.banStatusDto);
    await this.usersRepository.saveUser(user);
    // ban or unban user`s blogs
    await this.blogsRepository.banOrUnbanBlogOwner(
      command.banStatusDto.userId,
      command.banStatusDto.isBanned,
    );
    // ban or unban user`s  posts and likes
    await this.postsRepository.banOrUnbanPostOwner(
      command.banStatusDto.userId,
      command.banStatusDto.isBanned,
    );
    // ban or unban user`s  comments and likes
    await this.commentsRepository.banOrUnbanCommentsAndLikesOwner(
      command.banStatusDto.userId,
      command.banStatusDto.isBanned,
    );
    //all devices of user must be deleted, if user is banned
    if (command.banStatusDto.isBanned) {
      await this.devicesRepository.deleteAllUserDevices(
        command.banStatusDto.userId,
      );
    }
    return;
  }
}
