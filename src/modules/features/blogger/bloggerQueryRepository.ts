import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { BannedUsersForBlogType } from './users/types/bannedUsersForBlogType';
import { Status, StatusEntity } from '../public/status/domain/status.schema';

@Injectable()
export class BloggerQueryRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostEntity>,
    @InjectModel(Comment.name) private commentModel: Model<CommentEntity>,
    @InjectModel(Blog.name) private blogModel: Model<BlogEntity>,
    @InjectModel(Status.name) private statusModel: Model<StatusEntity>,
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
    const result = await Promise.all(
      comments.map(async (c) => {
        //find post by id to comment from array of posts
        const post = posts.find((p) => p._id.toString() === c.postId);
        const comment = {
          id: c._id.toString(),
          content: c.content,
          commentatorInfo: {
            userId: c.userId,
            userLogin: c.userLogin,
          },
          createdAt: c.createdAt,
          likesInfo: {
            likesCount: await this.statusModel.count({
              entityId: c._id,
              entity: 'comment',
              status: 'Like',
              isOwnerBanned: false,
            }),
            dislikesCount: await this.statusModel.count({
              entityId: c._id,
              entity: 'comment',
              status: 'Dislike',
              isOwnerBanned: false,
            }),
            myStatus: 'None',
          },
          postInfo: {
            id: post!._id.toString(),
            title: post!.title,
            blogId: post!.blogId,
            blogName: post!.blogName,
          },
        };
        //if blogger have like status
        const userReaction = await this.statusModel.findOne({
          entityId: c._id,
          entity: 'comment',
          userId: bloggerId,
        });
        // and put this status to view model of comment
        if (userReaction) {
          comment.likesInfo.myStatus = userReaction.status;
        }

        return comment;
      }),
    );
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: result,
    };
  }

  async findBannedUserForBlog(
    bloggerId: string,
    blogId: string,
    query: BannedUserQueryDtoType,
  ): Promise<BannedUsersForBlogType | null> {
    //check does blog exist
    const blog = await this.blogModel.findOne({
      _id: new Types.ObjectId(blogId),
    });
    console.log('banned users in blog:', blog?.bannedUsers);
    if (!blog) throw new NotFoundException('Blog with this id doesn`t exist');
    // check is blogger owner of blog
    if (blog.ownerId !== bloggerId)
      throw new ForbiddenException('You haven`t blog with this id');
    //get array of banned users by blog id
    const bannedUsers = await this.blogModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(blogId) },
      },
      {
        $unwind: '$bannedUsers',
      },
      {
        $match: {
          'bannedUsers.login': {
            $regex: query.searchLoginTerm ?? '',
            $options: 'i',
          },
        },
      },
      {
        $sort: {
          [`bannedUsers.${query.sortBy}`]: query.sortDirection,
        },
      },
      {
        $project: {
          _id: 0,
          id: '$bannedUsers.id',
          login: '$bannedUsers.login',
          isBanned: '$bannedUsers.isBanned',
          banDate: '$bannedUsers.banDate',
          banReason: '$bannedUsers.banReason',
        },
      },
      {
        $setWindowFields: { output: { totalCount: { $count: {} } } },
      },
      {
        $skip: (query.pageNumber - 1) * query.pageSize,
      },
      {
        $limit: query.pageSize,
      },
    ]);
    if (bannedUsers.length < 1) return null;
    //mapping to view form
    const result = bannedUsers.map((u) => ({
      id: u.id,
      login: u.login,
      banInfo: {
        isBanned: true,
        banDate: u.banDate,
        banReason: u.banReason,
      },
    }));
    console.log('result', result);
    return {
      pagesCount: Math.ceil(bannedUsers[0].totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: bannedUsers[0].totalCount,
      items: result,
    };
  }
}
