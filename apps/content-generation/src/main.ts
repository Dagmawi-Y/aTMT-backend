import { NestFactory } from '@nestjs/core';
import { BlogGeneratorModule } from './blog-generator/blog-generator.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create a hybrid application
  const app = await NestFactory.create(BlogGeneratorModule);

  // Configure the RabbitMQ microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    // Add your RabbitMQ options here
  });

  // Start listening for microservice messages
  await app.startAllMicroservices();

  // Start listening for HTTP requests on port 3333
  await app.listen(3333);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
