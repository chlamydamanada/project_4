import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogEntity } from '../domain/blog.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogEntity>) {}

  getBlogEntity() {
    /**
     * use to create blogEntity
     */
    return new this.blogModel();
  }

  async saveBlog(blog: BlogEntity): Promise<string> {
    const newBlog = await blog.save();
    return newBlog._id.toString();
  }

  async findBlogById(blogId: string) {
    const blog = await this.blogModel.findOne({
      _id: new Types.ObjectId(blogId),
    });
    return blog;
  }

  async deleteBlog(blogId: string): Promise<void> {
    await this.blogModel.deleteOne({
      _id: new Types.ObjectId(blogId),
    });
    return;
  }
}
