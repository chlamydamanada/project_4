import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { BlogsService } from '../../application/blogs.service';
import { BlogsQweryRepository } from '../repositoriesQwery/blogsQwery.repository';
import { blogViewType } from '../../types/blogsTypes/blogViewType';
import { blogsViewType } from '../../types/blogsTypes/blogsViewType';
import { PostsQweryRepository } from '../repositoriesQwery/postsQwery.repository';
import { postsViewType } from '../../types/postsTypes/postsViewType';
import { blogQueryType } from '../../types/blogsTypes/blogsQweryType';
import { blogInputModelType } from '../../types/blogsTypes/blogInputModelType';
import { postInputModelType } from '../../types/postsTypes/postInputModelType';
import { postViewType } from '../../types/postsTypes/postViewType';
import { PostsService } from '../../application/posts.service';
import { postQueryType } from '../../types/postsTypes/postsQweryType';
import { Response } from 'express';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly blogsQweryRepository: BlogsQweryRepository,
    private readonly postsQweryRepository: PostsQweryRepository,
  ) {}

  @Get()
  async getAllBlogs(
    @Query() query: blogQueryType,
  ): Promise<blogsViewType | string> {
    try {
      const blogs = await this.blogsQweryRepository.getAllBlogs(query);
      return blogs;
    } catch (e) {
      return 'blogs/getAllBlogs' + e;
    }
  }

  @Get(':id')
  async getBlogByBlogId(
    @Param('id')
    blogId: string,
    @Res() res: Response,
  ): Promise<blogViewType | any> {
    try {
      const blog = await this.blogsQweryRepository.getBlogByBlogId(blogId);
      if (!blog) {
        res.status(404).send('Blog with this id does not exist');
        return;
      }
      res.status(200).send(blog);
    } catch (e) {
      return 'blogs/getBlogByBlogId' + e;
    }
  }

  @Get(':blogId/posts')
  async getAllPostsByBlogId(
    @Param('blogId') blogId: string,
    @Query() query: postQueryType,
    @Res() res: Response,
  ): Promise<postsViewType | string> {
    try {
      const blog = await this.blogsQweryRepository.getBlogByBlogId(blogId);
      if (!blog) {
        res.status(404).send('Blog with this id does not exist');
        return;
      }

      const posts = await this.postsQweryRepository.getAllPostsByBlogId(
        blogId,
        query,
      );
      res.status(200).send(posts);
    } catch (e) {
      return 'blogs/getAllPostsByBlogId' + e;
    }
  }

  @Post()
  async createBlog(
    @Body() blogInputModel: blogInputModelType,
  ): Promise<blogViewType | string> {
    try {
      const newBlogId = await this.blogsService.createBlog(blogInputModel);
      const newBlog = await this.blogsQweryRepository.getBlogByBlogId(
        newBlogId,
      );
      return newBlog;
    } catch (e) {
      return 'blogs/createBlog ' + e;
    }
  }

  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() postInputModel: postInputModelType,
    @Res() res: Response,
  ): Promise<postViewType | string> {
    try {
      const blog = await this.blogsQweryRepository.getBlogByBlogId(blogId);
      if (!blog) {
        res.status(404).send('Blog with this id does not exist');
        return;
      }
      const newPostId = await this.postsService.createPost(
        postInputModel.title,
        postInputModel.shortDescription,
        postInputModel.content,
        blogId,
        blog.name,
      );
      const newPost = await this.postsQweryRepository.getPostByPostId(
        newPostId,
      );
      res.status(201).send(newPost);
    } catch (e) {
      return 'blogs/createPostByBlogId ' + e;
    }
  }

  @Put(':id')
  async updateBlog(
    @Param('id') blogId: string,
    @Body() blogInputModel: blogInputModelType,
    @Res() res: Response,
  ): Promise<string | number> {
    try {
      const isBlog = await this.blogsService.updateBlog(
        blogId,
        blogInputModel.name,
        blogInputModel.description,
        blogInputModel.websiteUrl,
      );
      if (!isBlog) {
        res.status(404).send('Blog with this id does not exist');
        return;
      }
      res.sendStatus(204);
    } catch (e) {
      return 'blogs/updateBlog ' + e;
    }
  }

  @Delete(':id')
  async deleteBlogByBlogId(
    @Param('id') blogId: string,
    @Res() res: Response,
  ): Promise<string | number> {
    try {
      const isBlog = await this.blogsQweryRepository.getBlogByBlogId(blogId);
      if (!isBlog) {
        res.status(404).send('Blog with this id does not exist');
        return;
      }
      await this.blogsService.deleteBlogByBlogId(blogId);
      res.sendStatus(204);
    } catch (e) {
      return 'blogs/deleteBlogByBlogId ' + e;
    }
  }
}
