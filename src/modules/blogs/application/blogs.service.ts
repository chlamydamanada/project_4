import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../repositories/blogs.repository';
import { blogInputDtoType } from '../types/blogInputModelType';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async createBlog(blogDTO: blogInputDtoType): Promise<string> {
    const newBlog = this.blogsRepository.getBlogEntity();
    newBlog.createBlog(blogDTO);
    const newBlogId = await this.blogsRepository.saveBlog(newBlog);
    return newBlogId;
  }

  async updateBlog(
    blogId: string,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<boolean> {
    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) return false;
    blog.updateBlog(name, description, websiteUrl);
    await this.blogsRepository.saveBlog(blog);
    return true;
  }
  async deleteBlogByBlogId(blogId: string): Promise<void> {
    await this.blogsRepository.deleteBlog(blogId);
    return;
  }

  async deleteAllBlogs(): Promise<void> {
    await this.blogsRepository.deleteAllBlogs();
    return;
  }
}
