import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../repositories/blogs.repository';
import { UpdatingBlogDtoType } from '../types/updatingBlogDtoType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdateBlogCommand {
  constructor(public blogDTO: UpdatingBlogDtoType) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async execute(command: UpdateBlogCommand): Promise<void> {
    const blog = await this.blogsRepository.findBlogById(
      command.blogDTO.blogId,
    );
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    if (blog.ownerId !== command.blogDTO.bloggerId)
      throw new ForbiddenException('Only owner of this blog can update it');
    blog.updateBlog(command.blogDTO);
    await this.blogsRepository.saveBlog(blog);
    return;
  }
}
