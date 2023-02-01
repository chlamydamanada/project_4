import { InjectModel } from '@nestjs/mongoose';
import { Post, PostEntity } from '../domain/post.schema';
import { Model, Types } from 'mongoose';

export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostEntity>) {}

  async savePost(post: PostEntity): Promise<string> {
    const newPost = await post.save();
    return newPost._id.toString();
  }

  async findPostById(postId: string) {
    const post = await this.postModel.findOne({
      _id: new Types.ObjectId(postId),
    });
    return post;
  }

  async deletePost(postId: string): Promise<void> {
    await this.postModel.deleteOne({
      _id: new Types.ObjectId(postId),
    });
    return;
  }

  async deleteAllPosts(): Promise<void> {
    await this.postModel.deleteMany({});
    return;
  }
}
