import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogEntity } from '../../domain/blog.schema';
import { Model, Types } from 'mongoose';
import { makeNameFilter } from '../../../../helpers/helperFunctions/nameFilter';
import { blogsViewType } from '../../types/blogsViewType';
import { blogViewType } from '../../types/blogViewType';
import { blogQueryType } from '../../types/blogsQweryType';
import { FindAllBlogsByFiltersType } from '../../types/findAllBlogsByFiltersType';

@Injectable()
export class BlogsQweryRepository {
  constructor(
    @InjectModel(Blog.name)
    private blogModel: Model<BlogEntity>,
  ) {}

  async getAllBlogs(
    query: blogQueryType,
    bloggerId?: string | null | undefined,
  ): Promise<blogsViewType | undefined> {
    // used by blogger with bloggerId,
    // used by users to see all blogs,
    const filter = makeNameFilter(query.searchNameTerm, bloggerId);
    const dbValues = await this.findAllBlogsByFilters(query, filter);
    // if no blogs found
    if (!dbValues.blogs) return undefined;
    //if some blogs found
    return this.makeViewBlogs(dbValues, query);
  }

  async getAllBlogsForSa(
    query: blogQueryType,
  ): Promise<blogsViewType | undefined> {
    // used by sa to see all blogs,
    const filter = makeNameFilter(query.searchNameTerm);
    const dbValues = await this.findAllBlogsByFilters(query, filter);
    // if no blogs found
    if (!dbValues.blogs) return undefined;
    //if some blogs found
    return this.makeViewBlogs(dbValues, query);
  }

  async getBlogByBlogId(blogId: string): Promise<blogViewType | undefined> {
    // used by users to see special blog
    const blog = await this.blogModel.findOne({
      _id: new Types.ObjectId(blogId),
    });
    if (!blog) return undefined;
    return this.makeViewBlog(blog);
  }

  private async findAllBlogsByFilters(
    queryFilter: blogQueryType,
    valueFilter: any,
  ): Promise<FindAllBlogsByFiltersType> {
    // find all blogs by filter and count number of them, return array of blogs and total count
    const totalCount = await this.blogModel.count(valueFilter);
    const blogs = await this.blogModel
      .find(valueFilter)
      .sort({ [queryFilter.sortBy]: queryFilter.sortDirection })
      .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
      .limit(queryFilter.pageSize);
    return {
      blogs,
      totalCount,
    };
  }

  private makeViewBlog(blog: BlogEntity): blogViewType {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }

  private makeViewBlogs(
    dbValues: FindAllBlogsByFiltersType,
    query: blogQueryType,
  ): blogsViewType | undefined {
    if (!dbValues.blogs) return undefined;
    const result = dbValues.blogs.map((b) => this.makeViewBlog(b));
    return {
      pagesCount: Math.ceil(dbValues.totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: dbValues.totalCount,
      items: result,
    };
  }
}
