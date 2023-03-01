import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogEntity } from '../../../../blogger/blogs/domain/blog.schema';
import { Model, Types } from 'mongoose';
import { blogsViewType } from '../../types/blogsViewType';
import { blogViewType } from '../../types/blogViewType';
import { blogQueryType } from '../../types/blogsQweryType';
import { FindAllBlogsByFiltersType } from '../../types/findAllBlogsByFiltersType';
import { BlogsSAType } from '../../../../blogger/blogs/types/blogsSAType';

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
    const filter = this.makeViewFilter(query.searchNameTerm, bloggerId);
    const dbValues = await this.findAllBlogsByFilters(query, filter);
    // if no blogs found
    if (!dbValues.blogs) return undefined;
    //if some blogs found
    return this.makeViewBlogs(dbValues, query);
  }

  async getAllBlogsBySA(
    query: blogQueryType,
  ): Promise<BlogsSAType | undefined> {
    // used by sa to see all blogs,
    const filter = this.makeNameFilter(query.searchNameTerm);
    const dbValues = await this.findAllBlogsByFilters(query, filter);
    // if no blogs found
    if (!dbValues.blogs) return undefined;
    //if some blogs found
    return this.makeBlogsForSA(dbValues, query);
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

  private makeBlogsForSA(
    dbValues: FindAllBlogsByFiltersType,
    query: blogQueryType,
  ): undefined | BlogsSAType {
    if (!dbValues.blogs) return undefined;
    const result = dbValues.blogs.map((b) => ({
      id: b._id.toString(),
      name: b.name,
      description: b.description,
      websiteUrl: b.websiteUrl,
      createdAt: b.createdAt,
      isMembership: b.isMembership,
      blogOwnerInfo: {
        userId: b.ownerId,
        userLogin: b.ownerLogin,
      },
    }));
    return {
      pagesCount: Math.ceil(dbValues.totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: dbValues.totalCount,
      items: result,
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

  private makeViewFilter(
    name: string | undefined,
    bloggerId?: string | null | undefined,
  ) {
    if (name && bloggerId) {
      return {
        name: { $regex: name, $options: 'i' },
        ownerId: bloggerId,
        isOwnerBanned: false,
      };
    }
    if (name) {
      return { name: { $regex: name, $options: 'i' }, isOwnerBanned: false };
    }
    if (bloggerId) {
      return { ownerId: bloggerId, isOwnerBanned: false };
    }
    return { isOwnerBanned: false };
  }

  makeNameFilter(name: string | undefined) {
    if (name) {
      return { name: { $regex: name, $options: 'i' } };
    }
    return {};
  }
}
