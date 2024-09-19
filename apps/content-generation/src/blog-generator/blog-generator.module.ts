import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BlogGeneratorService } from './blog-generator.service';
import { BlogGeneratorController } from './blog-generator.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import {
  Category,
  CategorySchema,
} from 'apps/content-generation/schemas/category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySeeder } from '../database/seeders/category-seeder';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/content_management'),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    ClientsModule.register([
      {
        name: 'CONTENT_MANAGEMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'blog_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [BlogGeneratorService, ConfigService, CategorySeeder],
  controllers: [BlogGeneratorController],
})
export class BlogGeneratorModule {}
