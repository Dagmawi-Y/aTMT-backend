import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument } from '../schemas/blog.schema';
import { CreateBlogDto, UpdateBlogDto, BlogFilterDto } from './dto/blog.dto';
import { Category } from '../schemas/category.schema';

@Injectable()
export class ContentManagementService {
  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<BlogDocument>,
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  private formatPaginationResult(
    docs: any[],
    totalDocs: number,
    page: number,
    limit: number,
  ) {
    const totalPages = Math.ceil(totalDocs / limit);
    page = Number(page);
    limit = Number(limit);
    return {
      data: docs,
      totalDocs,
      limit,
      totalPages,
      page,
      pagingCounter: (page - 1) * limit + 1,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  async createBlog(createBlogDto: CreateBlogDto): Promise<BlogDocument> {
    try {
      const createdBlog = new this.blogModel(createBlogDto);
      const savedBlog = await createdBlog.save();
      console.log(savedBlog, '\nSaved the new blog post to DB');
      return savedBlog;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllBlogs(filterDto: BlogFilterDto): Promise<any> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ...filters
    } = filterDto;
    const skip = (page - 1) * limit;

    const query = this.blogModel.find(filters);
    const totalDocs = await this.blogModel.countDocuments(filters);

    const docs = await query
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec();

    return this.formatPaginationResult(docs, totalDocs, page, limit);
  }

  async getBlogById(id: string): Promise<BlogDocument> {
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async updateBlog(
    id: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<BlogDocument> {
    const updatedBlog = await this.blogModel.findByIdAndUpdate(
      id,
      updateBlogDto,
      { new: true },
    );
    if (!updatedBlog) {
      throw new NotFoundException('Blog not found');
    }
    return updatedBlog;
  }

  async deleteBlog(id: string): Promise<void> {
    const result = await this.blogModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Blog not found');
    }
  }

  async getCategories(): Promise<any> {
    const categoriesWithBlogs = await this.categoryModel
      .aggregate([
        {
          $lookup: {
            from: 'blogs',
            let: { categoryName: '$name' },
            pipeline: [
              { $match: { $expr: { $eq: ['$category', '$$categoryName'] } } },
              { $sort: { createdAt: -1 } },
              { $limit: 5 },
            ],
            as: 'latestBlogs',
          },
        },
      ])
      .exec();

    return categoriesWithBlogs;
  }

  async getSubCategories(category?: string): Promise<string[]> {
    const query = category ? { category } : {};
    const subCategories = await this.blogModel.distinct('subCategory', query);
    return subCategories;
  }

  async getBlogsByCategory(
    category: string,
    filterDto: BlogFilterDto,
  ): Promise<any> {
    return this.getAllBlogs({ ...filterDto, category });
  }

  async getBlogsBySubCategory(
    subCategory: string,
    filterDto: BlogFilterDto,
  ): Promise<any> {
    return this.getAllBlogs({ ...filterDto, subCategory });
  }

  async searchBlogs(query: string, filterDto: BlogFilterDto): Promise<any> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filterDto;
    const skip = (page - 1) * limit;

    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { subCategory: { $regex: query, $options: 'i' } },
      ],
    };

    const totalDocs = await this.blogModel.countDocuments(searchQuery);

    const docs = await this.blogModel
      .find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec();

    return this.formatPaginationResult(docs, totalDocs, page, limit);
  }
}
