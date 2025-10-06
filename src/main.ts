import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger setup
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

  // Use dynamic port for Render or fallback to 3001
  const port = parseInt(process.env.PORT, 10) || 3001;
  await app.listen(port);

  logger.log('=================================');
  logger.log(`Backend server running on port: ${port}`);
  logger.log(`API Documentation available at: http://localhost:${port}/api/docs`);
  logger.log('=================================');
}

bootstrap();
