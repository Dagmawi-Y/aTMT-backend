import { NestFactory } from '@nestjs/core';
import { ContentManagementModule } from './content-management.module';

async function bootstrap() {
  const app = await NestFactory.create(ContentManagementModule);
  await app.listen(3334);
}
bootstrap();
