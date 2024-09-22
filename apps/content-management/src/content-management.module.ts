import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentManagementService } from './content-management.service';
import { ContentManagementController } from './content-management.controller';
import { BlogSchema } from '../schemas/blog.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategorySeeder } from './database/seeders/category-seeder';
import {
  Category,
  CategorySchema,
} from 'apps/content-management/schemas/category.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/content_management'),
    // MongooseModule.forRoot('mongodb://mongo:27017/content_management'),

    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get<string>('MONGODB_URI'),
    //   }),
    //   inject: [ConfigService],
    // }),
    MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }]),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [ContentManagementService, CategorySeeder],
  controllers: [ContentManagementController],
})
export class ContentManagementModule {}
