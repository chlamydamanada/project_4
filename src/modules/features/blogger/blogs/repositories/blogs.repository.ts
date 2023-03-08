import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogEntity } from '../domain/blog.schema';
import { Model, Types } from 'mongoose';
import { BannedUserForBlogType } from '../types/bannedUserForBlogType';
import {
  BanStatus,
  BanStatusEntity,
} from '../../banStatus/domain/banStatus.schema';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogEntity>) {}

  getBlogEntity() {
    // use to create blogEntity
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

  async isUserBannedByBlogger(
    userId: string,
    blogId: string,
  ): Promise<boolean> {
    const bannedUser = await this.blogModel.findOne({
      _id: new Types.ObjectId(blogId),
      'bannedUsers.id': userId,
    });
    if (!bannedUser) return false;
    return true;
  }
}
