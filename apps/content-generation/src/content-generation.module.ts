import { Module } from '@nestjs/common';
import { ContentGenerationController } from './content-generation.controller';
import { ContentGenerationService } from './content-generation.service';

@Module({
  imports: [],
  controllers: [ContentGenerationController],
  providers: [ContentGenerationService],
})
export class ContentGenerationModule {}
