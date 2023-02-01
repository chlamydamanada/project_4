import { Injectable } from '@nestjs/common';
import { blogViewType } from '../../types/blogsTypes/blogViewType';
import { blogsViewType } from '../../types/blogsTypes/blogsViewType';
import { blogQueryType } from '../../types/blogsTypes/blogsQweryType';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogEntity } from '../../domain/blog.schema';
import { Model, Types } from 'mongoose';
import { sortingQueryFields } from '../../helpers/qweryFilter';
import { makeNameFilter } from '../../helpers/nameFilter';
import { makeViewBlogs } from '../../helpers/makerViewBlogs';

@Injectable()
export class BlogsQweryRepository {
  constructor(
    @InjectModel(Blog.name)
    private blogModel: Model<BlogEntity>,
  ) {}

  async getAllBlogs(query: blogQueryType): Promise<blogsViewType> {
    const queryFilter = sortingQueryFields(query);
    const nameFilter = makeNameFilter(query.searchNameTerm);
    const totalCount = await this.blogModel.count(nameFilter);
    const blogs = await this.blogModel
      .find(nameFilter)
      .sort({ [queryFilter.sortBy]: queryFilter.sortDirection })
      .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
      .limit(queryFilter.pageSize);
    const result = makeViewBlogs(
      blogs,
      totalCount,
      queryFilter.pageSize,
      queryFilter.pageNumber,
    );
    return result;
  }

  async getBlogByBlogId(blogId: string): Promise<blogViewType | undefined> {
    const blog = await this.blogModel.findOne({
      _id: new Types.ObjectId(blogId),
    });
    if (!blog) return undefined;
    return blog.blogMapping(blog); //makeViewBlog(blog);
  }
}
