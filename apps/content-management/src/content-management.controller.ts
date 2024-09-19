import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
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
  @EventPattern('blog_created')
  async handleBlogCreated(
    @Payload() blogPost: any,
    @Ctx() context: RmqContext,
  ) {
    // const channel = context.getChannelRef();
    // const originalMsg = context.getMessage();
    // channel.ack(originalMsg);
    console.log(blogPost, '\nSaved the new blog post');
    return this.contentManagementService.saveBlog(blogPost);
  }
}
