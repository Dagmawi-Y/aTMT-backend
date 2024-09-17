import { NestFactory } from '@nestjs/core';
import { ContentGenerationModule } from './content-generation.module';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ContentGenerationModule,
    {},
  );
  await app.listen(3333);
}
bootstrap();
