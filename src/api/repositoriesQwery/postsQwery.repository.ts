import { Injectable } from '@nestjs/common';
import { postsViewType } from '../../types/postsTypes/postsViewType';
import { postViewType } from '../../types/postsTypes/postViewType';
import { postQueryType } from '../../types/postsTypes/postsQweryType';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostEntity } from '../../domain/post.schema';
import { Model, Types } from 'mongoose';

import { Status, StatusEntity } from '../../domain/status.schema';

@Injectable()
export class PostsQweryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostEntity>,
    @InjectModel(Status.name) private statusModel: Model<StatusEntity>,
  ) {}

  async getAllPosts(
    query: postQueryType,
    userId?: string | undefined | null,
  ): Promise<postsViewType> {
    const totalCount = await this.postModel.count({});
    const posts = await this.postModel
      .find({})
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
    const result = await Promise.all(
      posts.map(async (p) => await this.makeViewPost(p, userId)),
    );
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: result,
    };
  }

  async getAllPostsByBlogId(
    blogId: string,
    query: postQueryType,
    userId?: string | undefined | null,
  ): Promise<postsViewType> {
    const totalCount = await this.postModel.count({ blogId: blogId });
    const posts = await this.postModel
      .find({ blogId: blogId })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
    const result = await Promise.all(
      posts.map(async (p) => await this.makeViewPost(p, userId)),
    );
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: result,
    };
  }

  async getPostByPostId(
    postId: string,
    userId?: string | undefined | null,
  ): Promise<postViewType | undefined> {
    const post = await this.postModel.findOne({
      _id: new Types.ObjectId(postId),
    });
    if (!post) return undefined;
    const result = await this.makeViewPost(post, userId);
    return result;
  }
  async makeViewPost(
    post: PostEntity,
    userId?: string | undefined | null,
  ): Promise<postViewType> {
    const newPost: postViewType = {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: await this.statusModel.count({
          entityId: post._id,
          entity: 'post',
          status: 'Like',
        }),
        dislikesCount: await this.statusModel.count({
          entityId: post._id,
          entity: 'post',
          status: 'Dislike',
        }),
        myStatus: 'None',
        newestLikes: [],
      },
    };

    const newLikes = await this.statusModel
      .find({ entityId: post._id, entity: 'post', status: 'Like' })
      .sort({ addedAt: -1 })
      .limit(3)
      .lean();
    newPost.extendedLikesInfo.newestLikes = newLikes.map((s) => ({
      addedAt: s.addedAt,
      userId: s.userId,
      login: s.userLogin,
    }));

    if (!userId) return newPost;

    const userReaction = await this.statusModel.findOne({
      entityId: post._id,
      entity: 'post',
      userId: userId,
    });
    if (userReaction) {
      newPost.extendedLikesInfo.myStatus = userReaction.status;
    }

    return newPost;
  }
}
