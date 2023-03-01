import { BlogsRepository } from '../repositories/blogs.repository';
import { creatingBlogDtoType } from '../types/creatingBlogDtoType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateBlogCommand {
  constructor(public blogDTO: creatingBlogDtoType) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async execute(command: CreateBlogCommand): Promise<string> {
    const newBlog = this.blogsRepository.getBlogEntity();
    newBlog.createBlog(command.blogDTO);
    return this.blogsRepository.saveBlog(newBlog);
  }
}
