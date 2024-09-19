import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ContentManagementService } from './content-management.service';

@Controller()
export class ContentManagementController {
  constructor(
    private readonly contentManagementService: ContentManagementService,
  ) {}

  // getBlog(@Payload() data: any, @Ctx() context: RmqContext) {
  //   console.log({ data });
  // }
  @MessagePattern('blog_created')
  async handleBlogCreated(blogPost: any) {
    console.log('Got a new blog post:', blogPost);
    return this.contentManagementService.saveBlog(blogPost);
  }
}
