import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument } from '../schemas/blog.schema';

@Injectable()
export class ContentManagementService {
  constructor(
    @InjectModel('Blog') private readonly blogModel: Model<BlogDocument>,
  ) {}

  async saveBlog(blogPost: any) {
    const createdBlog = new this.blogModel(blogPost);
    return createdBlog.save();
  }
}
