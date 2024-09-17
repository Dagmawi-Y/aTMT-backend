import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentManagementService } from './content-management.service';
import { ContentManagementController } from './content-management.controller';
import { BlogSchema } from '../schemas/blog.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/content_management'),
    MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }]),
  ],
  providers: [ContentManagementService],
  controllers: [ContentManagementController],
})
export class ContentManagementModule {}
