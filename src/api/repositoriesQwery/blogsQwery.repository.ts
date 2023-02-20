import { Injectable } from '@nestjs/common';
import { blogViewType } from '../../types/blogsTypes/blogViewType';
import { blogsViewType } from '../../types/blogsTypes/blogsViewType';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogEntity } from '../../domain/blog.schema';
import { Model, Types } from 'mongoose';
import { makeNameFilter } from '../../helpers/helperFunctions/nameFilter';
import { makeViewBlogs } from '../../helpers/helperFunctions/makerViewBlogs';
import { makeViewBlog } from '../../helpers/helperFunctions/makerViewBlog';
import { blogQueryType } from '../../types/blogsTypes/blogsQweryType';

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
    const result = makeViewBlogs(
      blogs,
      totalCount,
      query.pageSize,
      query.pageNumber,
    );
    return result;
  }

  async getBlogByBlogId(blogId: string): Promise<blogViewType | undefined> {
    const blog = await this.blogModel.findOne({
      _id: new Types.ObjectId(blogId),
    });
    if (!blog) return undefined;
    return makeViewBlog(blog);
  }
}
