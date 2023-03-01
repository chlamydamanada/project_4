import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../repositories/blogs.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class DeleteBlogCommand {
  constructor(public blogId: string, public bloggerId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async execute(command: DeleteBlogCommand): Promise<void> {
    const blog = await this.blogsRepository.findBlogById(command.blogId);
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    if (blog.ownerId !== command.bloggerId)
      throw new ForbiddenException('Only owner of this blog can delete it');
    await this.blogsRepository.deleteBlog(command.blogId);
    return;
  }
}
