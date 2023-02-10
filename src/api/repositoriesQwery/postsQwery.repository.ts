import { Injectable } from '@nestjs/common';
import { postsViewType } from '../../types/postsTypes/postsViewType';
import { postViewType } from '../../types/postsTypes/postViewType';
import { postQueryType } from '../../types/postsTypes/postsQweryType';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostEntity } from '../../domain/post.schema';
import { Model, Types } from 'mongoose';
import { makeViewPost } from '../../helpers/makerViewPost';
import { sortingQueryFields } from '../../helpers/qweryFilter';
import { makeViewPosts } from '../../helpers/makerViewPosts';

@Injectable()
export class PostsQweryRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostEntity>) {}

  async getAllPosts(query: postQueryType): Promise<postsViewType> {
    const totalCount = await this.postModel.count({});
    const posts = await this.postModel
      .find({})
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
    const result = makeViewPosts(
      posts,
      totalCount,
      query.pageSize,
      query.pageNumber,
    );
    return result;
  }

  async getAllPostsByBlogId(
    blogId: string,
    query: postQueryType,
  ): Promise<postsViewType> {
    const totalCount = await this.postModel.count({ blogId: blogId });
    const posts = await this.postModel
      .find({ blogId: blogId })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
    const result = makeViewPosts(
      posts,
      totalCount,
      query.pageSize,
      query.pageNumber,
    );
    return result;
  }

  async getPostByPostId(postId: string): Promise<postViewType | undefined> {
    const post = await this.postModel.findOne({
      _id: new Types.ObjectId(postId),
    });
    if (!post) return undefined;
    const result = makeViewPost(post);
    return result;
  }
}
