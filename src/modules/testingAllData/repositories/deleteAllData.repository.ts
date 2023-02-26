import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceEntity } from '../../devices/domain/device.schema';
import { Model } from 'mongoose';
import { Blog, BlogEntity } from '../../blogs/domain/blog.schema';
import { Comment, CommentEntity } from '../../comments/domain/comment.schema';
import { Status, StatusEntity } from '../../status/domain/status.schema';
import { Post, PostEntity } from '../../posts/domain/post.schema';
import { User, UserEntity } from '../../users/domain/user.schema';

@Injectable()
export class DeleteAllDataRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogEntity>,
    @InjectModel(Device.name) private deviceModel: Model<DeviceEntity>,
    @InjectModel(Comment.name) private commentModel: Model<CommentEntity>,
    @InjectModel(Status.name) private statusModel: Model<StatusEntity>,
    @InjectModel(Post.name) private postModel: Model<PostEntity>,
    @InjectModel(User.name) private userModel: Model<UserEntity>,
  ) {}

  async deleteAllData(): Promise<void> {
    await Promise.all([
      this.blogModel.deleteMany({}),
      this.postModel.deleteMany({}),
      this.userModel.deleteMany({}),
      this.commentModel.deleteMany({}),
      this.deviceModel.deleteMany({}),
      this.statusModel.deleteMany({}),
    ]);

    return;
  }
}
