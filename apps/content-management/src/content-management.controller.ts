import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ContentManagementService } from './content-management.service';

@Controller()
export class ContentManagementController {
  constructor(
    private readonly contentManagementService: ContentManagementService,
  ) {}

  @MessagePattern('blog_created')
  async handleBlogCreated(blogPost: any) {
    return this.contentManagementService.saveBlog(blogPost);
  }
}
