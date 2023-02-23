import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogEntity } from '../../domain/blog.schema';
import { Model, Types } from 'mongoose';
import { makeNameFilter } from '../../../../helpers/helperFunctions/nameFilter';
import { blogsViewType } from '../../types/blogsViewType';
import { blogViewType } from '../../types/blogViewType';
import { blogQueryType } from '../../types/blogsQweryType';

@Injectable()
export class BlogsQweryRepository {
  constructor(
    @InjectModel(Blog.name)
    private blogModel: Model<BlogEntity>,
  ) {}

  async getAllBlogs(query: blogQueryType): Promise<blogsViewType> {
    const nameFilter = makeNameFilter(query.searchNameTerm);
    const totalCount = await this.blogModel.count(nameFilter);
    const blogs = await this.blogModel
      .find(nameFilter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
    const result = blogs.map((b) => this.makeViewBlog(b));
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: result,
    };
  }

  async getBlogByBlogId(blogId: string): Promise<blogViewType | undefined> {
    const blog = await this.blogModel.findOne({
      _id: new Types.ObjectId(blogId),
    });
    if (!blog) return undefined;
    return this.makeViewBlog(blog);
  }

  makeViewBlog(blog: BlogEntity) {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }
}
