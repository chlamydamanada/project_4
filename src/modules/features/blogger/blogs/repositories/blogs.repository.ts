import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogEntity } from '../domain/blog.schema';
import { Model, Types } from 'mongoose';
import { BannedUserForBlogType } from '../types/bannedUserForBlogType';

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

  async banOrUnbanBlogOwner(userId: string, banStatus: boolean): Promise<void> {
    await this.blogModel.updateMany(
      { ownerId: userId },
      { $set: { isOwnerBanned: banStatus } },
    );
  }

  async addBannedUserForBlog(
    blogId: string,
    user: BannedUserForBlogType,
  ): Promise<void> {
    const blog = await this.blogModel.findOneAndUpdate(
      { _id: new Types.ObjectId(blogId) },
      { $push: { bannedUsers: user } },
      { new: true, upsert: true },
    );
    console.log('blog:', blog.bannedUsers);
    return;
  }

  async deleteBannedUserFormBlog(
    blogId: string,
    userId: string,
  ): Promise<void> {
    await this.blogModel.updateOne(
      { _id: new Types.ObjectId(blogId) },
      { $pull: { bannedUsers: { id: userId } } },
      { multi: true },
    );
    return;
  }
}
