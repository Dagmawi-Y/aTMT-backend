import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ContentManagementService } from './content-management.service';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CreateBlogDto, UpdateBlogDto, BlogFilterDto } from './dto/blog.dto';

@Controller()
export class ContentManagementController {
  constructor(
    private readonly contentManagementService: ContentManagementService,
  ) {}
  // getBlog(@Payload() data: any, @Ctx() context: RmqContext) {
  //   console.log({ data });
  // }
  @EventPattern('blog_created')
  async handleBlogCreated(
    @Payload() blogPost: any,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
    return this.contentManagementService.createBlog(blogPost);
  }

  @Post()
  async createBlog(@Body() createBlogDto: CreateBlogDto) {
    return this.contentManagementService.createBlog(createBlogDto);
  }

  @Get()
  async getAllBlogs(@Query() filterDto: BlogFilterDto) {
    return this.contentManagementService.getAllBlogs(filterDto);
  }

  @Get('categories')
  async getCategories() {
    return this.contentManagementService.getCategories();
  }

  @Get('subcategories')
  async getSubCategories(@Query('category') category?: string) {
    return this.contentManagementService.getSubCategories(category);
  }

  @Get('search')
  async searchBlogs(
    @Query('q') query: string,
    @Query() filterDto: BlogFilterDto,
  ) {
    return this.contentManagementService.searchBlogs(query, filterDto);
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return this.contentManagementService.getBlogById(id);
  }

  @Put(':id')
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.contentManagementService.updateBlog(id, updateBlogDto);
  }

  @Delete(':id')
  async deleteBlog(@Param('id') id: string) {
    return this.contentManagementService.deleteBlog(id);
  }

  @Get('category/:category')
  async getBlogsByCategory(
    @Param('category') category: string,
    @Query() filterDto: BlogFilterDto,
  ) {
    return this.contentManagementService.getBlogsByCategory(
      category,
      filterDto,
    );
  }

  @Get('subcategory/:subcategory')
  async getBlogsBySubCategory(
    @Param('subcategory') subcategory: string,
    @Query() filterDto: BlogFilterDto,
  ) {
    return this.contentManagementService.getBlogsBySubCategory(
      subcategory,
      filterDto,
    );
  }
}
