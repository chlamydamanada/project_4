import { creatingPostDtoType } from '../postsTypes/creatingDtoType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { PostsRepository } from '../repositories/posts.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class CreatePostCommand {
  constructor(public postDto: creatingPostDtoType) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async execute(command: CreatePostCommand): Promise<string> {
    const blog = await this.blogsRepository.findBlogById(
      command.postDto.blogId,
    );
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    if (blog.ownerId !== command.postDto.bloggerId)
      throw new ForbiddenException('Only owner of this blog can create post');
    const newPost = this.postsRepository.getPostEntity();
    newPost.createPost(command.postDto, blog.name);
    const newPostId = await this.postsRepository.savePost(newPost);
    return newPostId;
  }
}
