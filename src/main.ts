import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //app.useGlobalPipes(
  //new ValidationPipe({
  //stopAtFirstError: true,
  //exceptionFactory: (errors) => {
  // const result = errors.map();
  //},
  //}),
  //);
  //app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
