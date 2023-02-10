import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogsRepository } from '../repositories/blogs.repository';
import { Post, PostEntity } from '../domain/post.schema';
import { PostsRepository } from '../repositories/posts.repository';
import { creatingPostDtoType } from '../types/postsTypes/creatingDtoType';
import { updatingPostDtoType } from '../types/postsTypes/updatingPostDtoType';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostEntity>,
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
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
  async deletePostByPostId(postId: string): Promise<void> {
    await this.postsRepository.deletePost(postId);
    return;
  }

  async deleteAllPosts(): Promise<void> {
    await this.postsRepository.deleteAllPosts();
    return;
  }
}
