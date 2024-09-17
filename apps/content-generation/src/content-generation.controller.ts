import { Controller, Get } from '@nestjs/common';
import { ContentGenerationService } from './content-generation.service';

@Controller()
export class ContentGenerationController {
  constructor(private readonly contentGenerationService: ContentGenerationService) {}

  @Get()
  getHello(): string {
    return this.contentGenerationService.getHello();
  }
}
