import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogsRepository } from '../repositories/blogs.repository';
import { creatingBlogDtoType } from '../types/creatingBlogDtoType';
import { UpdatingBlogDtoType } from '../types/updatingBlogDtoType';
import { UsersRepository } from '../../users/repositories/users.repository';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createBlog(blogDTO: creatingBlogDtoType): Promise<string> {
    //find user by blogger id. take login and put to new blog
    const newBlog = this.blogsRepository.getBlogEntity();
    newBlog.createBlog(blogDTO);
    return this.blogsRepository.saveBlog(newBlog);
  }

  async updateBlog(blogDTO: UpdatingBlogDtoType): Promise<void> {
    const blog = await this.blogsRepository.findBlogById(blogDTO.blogId);
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    if (blog.ownerId !== blogDTO.bloggerId)
      throw new ForbiddenException('Only owner of this blog can update it');
    blog.updateBlog(blogDTO);
    await this.blogsRepository.saveBlog(blog);
    return;
  }
  async deleteBlogByBlogId(blogId: string, bloggerId: string): Promise<void> {
    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    if (blog.ownerId !== bloggerId)
      throw new ForbiddenException('Only owner of this blog can delete it');
    await this.blogsRepository.deleteBlog(blogId);
    return;
  }

  async blogBindToUser(blogId: string, userId: string): Promise<void> {
    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog)
      throw new BadRequestException([
        { message: 'Blog not found', field: 'blogId' },
      ]);
    const ownerOfBlog = await this.usersRepository.findUserById(blog.ownerId);
    if (ownerOfBlog)
      throw new BadRequestException([
        { message: 'Blog already bound to any user', field: 'blogId' },
      ]);
    const user = await this.usersRepository.findUserById(userId);
    if (!user)
      throw new BadRequestException([
        { message: 'User not found', field: 'userId' },
      ]);
    blog.updateOwnerId(userId, user.login);
    await this.blogsRepository.saveBlog(blog);
    return;
  }
}
