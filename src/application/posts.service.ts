import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogsRepository } from '../repositories/blogs.repository';
import { Post, PostEntity } from '../domain/post.schema';
import { PostsRepository } from '../repositories/posts.repository';
import { creatingPostDtoType } from '../types/postsTypes/creatingDtoType';
import { updatingPostDtoType } from '../types/postsTypes/updatingPostDtoType';
import { StatusPipe } from '../api/pipes/status/statusPipe';
import { UsersRepository } from '../repositories/users.repository';
import { Status, StatusEntity } from '../domain/status.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostEntity>,
    @InjectModel(Status.name) private statusModel: Model<StatusEntity>,
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async createPost(postDto: creatingPostDtoType): Promise<string> {
    const blog = await this.blogsRepository.findBlogById(postDto.blogId);
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    const newPost = new this.postModel();
    newPost.createPost(postDto, blog.name);
    const newPostId = await this.postsRepository.savePost(newPost);
    return newPostId;
  }

  async updatePost(
    postDto: updatingPostDtoType,
    postId: string,
  ): Promise<void> {
    const blog = await this.blogsRepository.findBlogById(postDto.blogId);
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new NotFoundException('Post with this id does not exist');
    if (blog.id !== post.blogId)
      throw new NotFoundException('This post does not belong to this blog');
    post.updatePost(postDto);
    await this.postsRepository.savePost(post);
    return;
  }

  async generatePostStatusById(
    postId: string,
    userId: string,
    statusDto: StatusPipe,
  ): Promise<void> {
    //first step: find post by id and check does it exist
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new NotFoundException('Post with this id does not exist');

    // second step: find user by id from token
    const user = await this.usersRepository.findUserById(userId);

    //third step: find status for this post by postId, userId and name of entity - post
    const statusOfPost = await this.postsRepository.findStatusOfPost(
      'post',
      postId,
      userId,
    );

    //if status not found, should create it
    if (!statusOfPost) {
      const newStatus = new this.statusModel();
      newStatus.createStatus({
        entity: 'post',
        entityId: postId,
        userId,
        userLogin: user!.login,
        status: statusDto.likeStatus,
      });
      await this.postsRepository.saveStatus(newStatus);
      return;
    }

    //if status found, should update it
    statusOfPost.updateStatus(statusDto.likeStatus);
    await this.postsRepository.saveStatus(statusOfPost);
    return;
  }

  async deletePostByPostId(postId: string): Promise<void> {
    await this.postsRepository.deletePost(postId);
    return;
  }

  async deleteAllPosts(): Promise<void> {
    await this.postsRepository.deleteAllPosts();
    return;
  }
}
