import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as request from 'supertest';
import { blogsData } from './blogsData';

describe('AppController', () => {
  let app: INestApplication;
  let server: any;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });
  describe('BLOGS', () => {
    beforeAll(async () => {
      await request(server).delete('/testing/all-data').expect(204);
    });
    describe('GET/ should return [] blogs with default pagination', () => {
      it('should return [] blogs with default pagination: STATUS 200', async () => {
        await request(server).get('/blogs').expect(200, blogsData.emptyBlogs);
      });
      describe('CREATE one blog with correct data and return it in view form', () => {
        let blogId: string | null = null;
        it('should create correct blog and return it: STATUS 201', async () => {
          const newBlog = await request(server)
            .post('/blogs')
            .send(blogsData.validBlog_1)
            .expect(201);

          blogId = newBlog.body.id;

          expect(newBlog.body).toEqual({
            id: expect.any(String),
            ...blogsData.validBlog_1,
            createdAt: expect.any(String),
          });
        });
        it('should return new blog by blogId: STATUS 200', async () => {
          const blog = await request(server)
            .get(`/blogs/${blogId}`)
            .expect(200);

          expect(blog.body).toEqual({
            id: blogId,
            ...blogsData.validBlog_1,
            createdAt: expect.any(String),
          });
        });
      });
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
