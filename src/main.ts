import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Attachments Management Microservice')
    .setDescription('API Documentation for file uplods handling')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('attachment/api', app, document);

  await app.listen(3016);
}
bootstrap();
