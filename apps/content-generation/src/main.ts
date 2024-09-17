import { NestFactory } from '@nestjs/core';
import { ContentGenerationModule } from './content-generation.module';

async function bootstrap() {
  const app = await NestFactory.create(ContentGenerationModule);
  await app.listen(3333);
}
bootstrap();
