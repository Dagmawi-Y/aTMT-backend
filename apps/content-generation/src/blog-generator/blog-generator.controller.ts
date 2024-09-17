import { Controller, Get } from '@nestjs/common';
import { BlogGeneratorService } from './blog-generator.service';

@Controller('blog-generator')
export class BlogGeneratorController {
  constructor(private readonly blogGeneratorService: BlogGeneratorService) {}

  @Get('generate')
  generateBlog() {
    return this.blogGeneratorService.handleCron();
  }
}
