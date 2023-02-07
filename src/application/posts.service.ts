import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogsRepository } from '../repositories/blogs.repository';
import { Post, PostEntity } from '../domain/post.schema';
import { PostsRepository } from '../repositories/posts.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostEntity>,
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}
  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
  ): Promise<string> {
    const newPost = new this.postModel({
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
    });
    const newPostId = await this.postsRepository.savePost(newPost);
    return newPostId;
  }

  async updatePost(
    postId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
  ): Promise<boolean> {
    // find blog by id
    const post = await this.postsRepository.findPostById(postId);
    // if(!blog) return false;
    if (!post) return false;
    post.title = title;
    post.shortDescription = shortDescription;
    post.content = content;
    await this.postsRepository.savePost(post);
    return true;
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
