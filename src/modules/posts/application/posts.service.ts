import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { creatingPostDtoType } from '../postsTypes/creatingDtoType';
import { PostsRepository } from '../repositories/posts.repository';
import { StatusPipe } from '../../status/api/pipes/statusPipe';
import { UsersRepository } from '../../users/repositories/users.repository';
import { updatingPostDtoType } from '../postsTypes/updatingPostDtoType';
import { DeletingDtoType } from '../postsTypes/deletingDtoType';
import { UserInfoType } from '../../auth/types/userInfoType';

@Injectable()
export class PostsService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async createPost(postDto: creatingPostDtoType): Promise<string> {
    const blog = await this.blogsRepository.findBlogById(postDto.blogId);
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    if (blog.ownerId !== postDto.bloggerId)
      throw new ForbiddenException('Only owner of this blog can create post');
    const newPost = this.postsRepository.getPostEntity();
    newPost.createPost(postDto, blog.name);
    const newPostId = await this.postsRepository.savePost(newPost);
    return newPostId;
  }

  async updatePost(postDto: updatingPostDtoType): Promise<void> {
    const blog = await this.blogsRepository.findBlogById(postDto.blogId);
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    if (blog.ownerId !== postDto.bloggerId)
      throw new ForbiddenException('Only owner of this blog can update post');
    const post = await this.postsRepository.findPostByPostIdAndBlogId(
      postDto.postId,
      postDto.blogId,
    );
    if (!post) throw new NotFoundException('Post with this id does not exist');
    post.updatePost(postDto);
    await this.postsRepository.savePost(post);
    return;
  }

  async generatePostStatusById(
    postId: string,
    userInfo: UserInfoType,
    statusDto: StatusPipe,
  ): Promise<void> {
    //first step: find post by id and check does it exist
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new NotFoundException('Post with this id does not exist');

    //third step: find status for this post by postId, userId and name of entity - post
    const statusOfPost = await this.postsRepository.findStatusOfPost(
      'post',
      postId,
      userInfo.id,
    );

    //if status not found, should create it
    if (!statusOfPost) {
      const newStatus = this.postsRepository.getStatusEntity();
      newStatus.createStatus({
        entity: 'post',
        entityId: postId,
        userId: userInfo.id,
        userLogin: userInfo.login,
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

  async deletePostByPostId(postDto: DeletingDtoType): Promise<void> {
    const blog = await this.blogsRepository.findBlogById(postDto.blogId);
    if (!blog) throw new NotFoundException('Blog with this id does not exist');
    if (blog.ownerId !== postDto.bloggerId)
      throw new ForbiddenException('Only owner of this blog can delete post');
    const post = await this.postsRepository.findPostByPostIdAndBlogId(
      postDto.postId,
      postDto.blogId,
    );
    if (!post) throw new NotFoundException('Post with this id does not exist');
    await this.postsRepository.deletePost(postDto.postId);
    return;
  }
}
