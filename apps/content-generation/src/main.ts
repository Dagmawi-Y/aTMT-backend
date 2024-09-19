import { NestFactory } from '@nestjs/core';
import { BlogGeneratorModule } from './blog-generator/blog-generator.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(BlogGeneratorModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'blog_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(3333);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
