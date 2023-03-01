import { InjectModel } from '@nestjs/mongoose';
import { Post, PostEntity } from '../domain/post.schema';
import { Model, Types } from 'mongoose';
import {
  Status,
  StatusEntity,
} from '../../../public/status/domain/status.schema';

export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostEntity>,
    @InjectModel(Status.name) private statusModel: Model<StatusEntity>,
  ) {}

  getPostEntity() {
    return new this.postModel();
  }

  getStatusEntity() {
    return new this.statusModel();
  }

  async savePost(post: PostEntity): Promise<string> {
    const newPost = await post.save();
    return newPost._id.toString();
  }

  async saveStatus(status: StatusEntity) {
    await status.save();
    return;
  }

  async findPostById(postId: string) {
    const post = await this.postModel.findOne({
      _id: new Types.ObjectId(postId),
    });
    return post;
  }

  async findPostByPostIdAndBlogId(postId: string, blogId: string) {
    const post = await this.postModel.findOne({
      _id: new Types.ObjectId(postId),
      blogId: blogId,
    });
    return post;
  }

  async findStatusOfPost(
    entity: string,
    postId: string,
    userId: string,
  ): Promise<undefined | StatusEntity> {
    const status = await this.statusModel.findOne({
      entityId: postId,
      entity: entity,
      userId: userId,
    });
    if (!status) return undefined;
    return status;
  }

  async deletePost(postId: string): Promise<void> {
    await this.postModel.deleteOne({
      _id: new Types.ObjectId(postId),
    });
    return;
  }

  async banOrUnbanPostOwner(userId: string, banStatus: boolean): Promise<void> {
    await this.postModel.updateMany(
      { ownerId: userId },
      { $set: { isOwnerBanned: banStatus } },
    );
    await this.statusModel.updateMany(
      {
        entity: 'post',
        userId: userId,
      },
      { $set: { isOwnerBanned: banStatus } },
    );
    return;
  }
}
