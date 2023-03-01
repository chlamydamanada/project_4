import { DeletingDtoType } from '../postsTypes/deletingDtoType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { PostsRepository } from '../repositories/posts.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class DeletePostCommand {
  constructor(public postDto: DeletingDtoType) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}
  async execute(command: DeletePostCommand): Promise<void> {
    const blog = await this.blogsRepository.findBlogById(
      command.postDto.blogId,
    );
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    if (blog.ownerId !== command.postDto.bloggerId)
      throw new ForbiddenException('Only owner of this blog can delete post');
    const post = await this.postsRepository.findPostByPostIdAndBlogId(
      command.postDto.postId,
      command.postDto.blogId,
    );
    if (!post) throw new NotFoundException('Post with this id does not exist');
    await this.postsRepository.deletePost(command.postDto.postId);
    return;
  }
}
