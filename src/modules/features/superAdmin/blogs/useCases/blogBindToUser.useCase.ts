import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../blogger/blogs/repositories/blogs.repository';
import { UsersRepository } from '../../users/repositories/users.repository';
import { BadRequestException } from '@nestjs/common';

export class BlogBindToUserCommand {
  constructor(public blogId: string, public userId: string) {}
}

@CommandHandler(BlogBindToUserCommand)
export class BlogBindToUserUseCase
  implements ICommandHandler<BlogBindToUserCommand>
{
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async execute(command: BlogBindToUserCommand): Promise<void> {
    const blog = await this.blogsRepository.findBlogById(command.blogId);
    if (!blog)
      throw new BadRequestException([
        { message: 'Blog not found', field: 'blogId' },
      ]);
    const ownerOfBlog = await this.usersRepository.findUserById(blog.ownerId);
    if (ownerOfBlog)
      throw new BadRequestException([
        { message: 'Blog already bound to any user', field: 'blogId' },
      ]);
    const user = await this.usersRepository.findUserById(command.userId);
    if (!user)
      throw new BadRequestException([
        { message: 'User not found', field: 'userId' },
      ]);
    blog.updateOwnerId(command.userId, user.login);
    await this.blogsRepository.saveBlog(blog);
    return;
  }
}
