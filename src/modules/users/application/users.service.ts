import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { UserInputModelType } from '../usersTypes/userInputModelType';
import { UpdatingBanStatusDtoType } from '../usersTypes/updatingBanStatusDtoType';
import { DevicesRepository } from '../../devices/repositories/device.repository';
import { CommentsRepository } from '../../comments/repositories/comments.repository';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly devicesRepository: DevicesRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async createUser(userInputModel: UserInputModelType): Promise<string> {
    const isExistByLogin = await this.usersRepository.findUserByLoginOrEmail(
      userInputModel.login,
    );
    if (isExistByLogin)
      throw new BadRequestException([
        {
          message: 'login already exist',
          field: 'login',
        },
      ]);
    const isExistByEmail = await this.usersRepository.findUserByLoginOrEmail(
      userInputModel.email,
    );
    if (isExistByEmail)
      throw new BadRequestException([
        {
          message: 'Email already exist',
          field: 'email',
        },
      ]);
    const newUser = this.usersRepository.getUserEntity();
    await newUser.createUser(userInputModel);
    const newUserId = await this.usersRepository.saveUser(newUser);
    return newUserId;
  }

  async deleteUserById(userId: string): Promise<void> {
    const user = await this.usersRepository.findUserById(userId);
    if (!user) throw new NotFoundException('User with this id does not exist');

    await this.usersRepository.deleteUserById(userId);
    return;
  }

  async updateBanStatus(banStatusDto: UpdatingBanStatusDtoType): Promise<void> {
    const user = await this.usersRepository.findUserById(banStatusDto.userId);
    if (!user) throw new NotFoundException('User with this id does not exist');
    // ban or unban user
    user.banOrUnbanUser(banStatusDto);
    await this.usersRepository.saveUser(user);
    // ban or unban user`s blogs
    await this.blogsRepository.banOrUnbanBlogOwner(
      banStatusDto.userId,
      banStatusDto.isBanned,
    );
    // ban or unban user`s  posts and likes
    await this.postsRepository.banOrUnbanPostOwner(
      banStatusDto.userId,
      banStatusDto.isBanned,
    );
    // ban or unban user`s  comments and likes
    await this.commentsRepository.banOrUnbanCommentsAndLikesOwner(
      banStatusDto.userId,
      banStatusDto.isBanned,
    );
    //all devices of user must be deleted, if user is banned
    if (banStatusDto.isBanned) {
      await this.devicesRepository.deleteAllUserDevices(banStatusDto.userId);
    }
    return;
  }
}
