import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { HttpExceptionFilter } from '../../../exception.filter';
import { useContainer } from 'class-validator';
import request from 'supertest';

describe('AppController', () => {
  let app: INestApplication;
  let server: any;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        //transformOptions: { enableImplicitConversion: true },
        stopAtFirstError: true,
        exceptionFactory: (errors) => {
          const result = errors.map((e) => ({
            message: Object.values(e.constraints!)[0],
            field: e.property,
          }));
          throw new BadRequestException(result);
        },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    server = app.getHttpServer();
    await app.init();
  });
  beforeAll(async () => {
    await request(server).delete('/testing/all-data').expect(204);
  });
  describe('GET/ should return [] without blogs with default qwery', () => {
    it('shouldn`t return [] without blogs with default qwery: STATUS 401 Unauthorized', async () => {
      await request(server).get('/blogger/blogs').expect(401);
    });
    it('should return [] without blogs with default qwery: STATUS 200', async () => {
      //step 1: registration
      //step 2: login
      //step 3: get your blogs
    });
  });
});
