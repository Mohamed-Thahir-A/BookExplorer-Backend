import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
     allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  app.setGlobalPrefix('api');
  
  const config = new DocumentBuilder()
    .setTitle('Product Explorer API')
    .setDescription('API for scraping and managing product data from World of Books')
    .setVersion('1.0')
    .addTag('navigation', 'Navigation endpoints')
    .addTag('categories', 'Category endpoints')
    .addTag('products', 'Product endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(3001);
  
  logger.log('=================================');
  logger.log('Backend server: http://localhost:3001');
  logger.log('API Documentation: http://localhost:3001/api/docs');
  logger.log('=================================');
}

bootstrap();