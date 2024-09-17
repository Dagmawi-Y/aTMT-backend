import { Controller, Get } from '@nestjs/common';
import { ContentManagementService } from './content-management.service';

@Controller()
export class ContentManagementController {
  constructor(private readonly contentManagementService: ContentManagementService) {}

  @Get()
  getHello(): string {
    return this.contentManagementService.getHello();
  }
}
