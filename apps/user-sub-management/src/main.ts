import { NestFactory } from '@nestjs/core';
import { UserSubManagementModule } from './user-sub-management.module';

async function bootstrap() {
  const app = await NestFactory.create(UserSubManagementModule);
  await app.listen(3335);
}
bootstrap();
