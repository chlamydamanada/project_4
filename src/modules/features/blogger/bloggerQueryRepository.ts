import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostEntity } from './posts/domain/post.schema';
import {
  Comment,
  CommentEntity,
} from '../public/comments/domain/comment.schema';
import { commentQueryType } from '../public/comments/commentsTypes/commentQweryType';
import { CommentsViewForBloggerType } from './comments/types/commentsViewForBloggerType';
import { BannedUserQueryDtoType } from './blogs/types/bannedUserQueryDtoType';
import { Blog, BlogEntity } from './blogs/domain/blog.schema';

@Injectable()
export class BloggerQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostEntity>,
    @InjectModel(Comment.name) private commentModel: Model<CommentEntity>,
    @InjectModel(Blog.name) private blogModel: Model<BlogEntity>,
  ) {}

  async findAllCommentsForAllPosts(
    bloggerId: string,
    query: commentQueryType,
  ): Promise<CommentsViewForBloggerType | null> {
    //get array of all blogger`s posts by blogger id
    const posts = await this.postModel.find({ ownerId: bloggerId }).lean();
    if (!posts) return null;
    // get array of all comments by filter, get page number by page size
    const comments = await this.commentModel
      .find({ postId: posts.map((post) => post._id), isOwnerBanned: false })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .lean();
    if (!comments) return null;
    // get number of comments for posts by filter
    const totalCount = await this.commentModel.count({
      postId: posts.map((post) => post._id),
      isOwnerBanned: false,
    });
    // get array of comments in view form for blogger
    const result = comments.map((c) => {
      //find post by id to comment from array of posts
      const post = posts.find((p) => p._id.toString() === c.postId);
      return {
        id: c._id.toString(),
        content: c.content,
        commentatorInfo: {
          userId: c.userId,
          userLogin: c.userLogin,
        },
        createdAt: c.createdAt,
        postInfo: {
          id: post!._id.toString(),
          title: post!.title,
          blogId: post!.blogId,
          blogName: post!.blogName,
        },
      };
    });
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: result,
    };
  }

  async findBannedUserForBlog(
    blogId: string,
    query: BannedUserQueryDtoType,
  ) /*: Promise<BannedUsersForBlogType | null>*/ {
    const loginFilter = this.makeLoginFilter(blogId, query.searchLoginTerm);
    //get array of banned users by blog id
    const bannedUsers = await this.blogModel
      .find({ _id: new Types.ObjectId(blogId) })
      .sort({ [`bannedUsers.${query.sortBy}`]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .lean();
    console.log('bannedUsers: ', bannedUsers);
    if (!bannedUsers) return null;
    // count number of banned users
    const totalCount = await this.blogModel.count(loginFilter);
    /*const result = bannedUsers.map((u) => ({
      id: u.userInfo.userId,
      login: u.userInfo.userLogin,
      banInfo: u.banInfo,
    }));
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: {},
    };*/
    return;
  }

  makeLoginFilter(blogId: string, login?: string | undefined) {
    if (login)
      return {
        _id: new Types.ObjectId(blogId),
        'bannedUsers.login': { $regex: login, $options: 'i' },
        bannedUsers: { $elemMatch: { isBanned: true } },
      };
    return {
      _id: new Types.ObjectId(blogId),
      bannedUsers: { $elemMatch: { isBanned: true } },
    };
  }
}
