import { NestFactory } from '@nestjs/core';
import { BlogGeneratorModule } from './blog-generator/blog-generator.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BlogGeneratorModule,
    {
      transport: Transport.RMQ,
    },
  );
  await app.listen();
}
bootstrap();
