import { NestFactory } from '@nestjs/core';
import { ContentManagementModule } from './content-management.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CategorySeeder } from './database/seeders/category-seeder';

async function bootstrap() {
  const app = await NestFactory.create(ContentManagementModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'blog_queue',
      noAck: false,
      queueOptions: {
        durable: false,
      },
    },
  });

  const seeder = app.get(CategorySeeder);
  await seeder.seed();

  await app.startAllMicroservices();

  await app.listen(3334);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
