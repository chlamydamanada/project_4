import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import request from 'supertest';
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
      describe('CREATE -> GET one blog with correct data and return it in view form', () => {
        let blogId: string | null = null;
        it('should create correct blog and return it: STATUS 201', async () => {
          const newBlog = await request(server)
            .post('/blogs')
            .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
            .send(blogsData.validBlog_1)
            .expect(201);

          blogId = newBlog.body.id;

          expect(newBlog.body).toEqual({
            id: expect.any(String),
            ...blogsData.validBlog_1,
            createdAt: expect.any(String),
            isMembership: true,
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
            isMembership: true,
          });
        });
      });
      describe('CREATE -> GET 2 blogs with correct data and return it in view form with default pagination', () => {
        it('should create 2 blogs with correct data: STATUS 201', async () => {
          const newBlog_2 = await request(server)
            .post('/blogs')
            .send(blogsData.validBlog_2)
            .expect(201);
          const newBlog_3 = await request(server)
            .post('/blogs')
            .send(blogsData.validBlog_3)
            .expect(201);

          expect(newBlog_2.body).toEqual({
            id: expect.any(String),
            ...blogsData.validBlog_2,
            createdAt: expect.any(String),
          });
          expect(newBlog_3.body).toEqual({
            id: expect.any(String),
            ...blogsData.validBlog_3,
            createdAt: expect.any(String),
          });
        });
        it('should return 3 blogs in view form with default pagination: STATUS 200', async () => {
          const blogs = await request(server).get(`/blogs`).expect(200);
          expect(blogs.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 3,
            items: [
              {
                id: expect.any(String),
                ...blogsData.validBlog_3,
                createdAt: expect.any(String),
              },
              {
                id: expect.any(String),
                ...blogsData.validBlog_2,
                createdAt: expect.any(String),
              },
              {
                id: expect.any(String),
                ...blogsData.validBlog_1,
                createdAt: expect.any(String),
              },
            ],
          });
        });
      });
      describe('CREATE -> GET -> UPDATE -> GET blog with correct data and return it in view form', () => {
        let blogId: string | null = null;
        it('should create correct blog and return it: STATUS 201', async () => {
          const newBlog = await request(server)
            .post('/blogs')
            .send(blogsData.validBlog_4)
            .expect(201);

          blogId = newBlog.body.id;

          expect(newBlog.body).toEqual({
            id: expect.any(String),
            ...blogsData.validBlog_4,
            createdAt: expect.any(String),
          });
        });
        it('should return new blog by blogId: STATUS 200', async () => {
          const blog = await request(server)
            .get(`/blogs/${blogId}`)
            .expect(200);

          expect(blog.body).toEqual({
            id: blogId,
            ...blogsData.validBlog_4,
            createdAt: expect.any(String),
          });
        });
        it('should update blog by id with correct data: STATUS 204', async () => {
          await request(server)
            .put(`/blogs/${blogId}`)
            .send(blogsData.validBlog_5)
            .expect(204);
        });
        it('should return updated blog: STATUS 200', async () => {
          const blog = await request(server)
            .get(`/blogs/${blogId}`)
            .expect(200);

          expect(blog.body).toEqual({
            id: blogId,
            ...blogsData.validBlog_5,
            createdAt: expect.any(String),
          });
        });
      });
      describe('CREATE -> GET -> DELETE -> GET blog with correct data and return not found', () => {
        let blogId: string | null = null;
        it('should create correct blog and return it: STATUS 201', async () => {
          const newBlog = await request(server)
            .post('/blogs')
            .send(blogsData.validBlog_4)
            .expect(201);

          blogId = newBlog.body.id;

          expect(newBlog.body).toEqual({
            id: expect.any(String),
            ...blogsData.validBlog_4,
            createdAt: expect.any(String),
          });
        });
        it('should return new blog by blogId: STATUS 200', async () => {
          const blog = await request(server)
            .get(`/blogs/${blogId}`)
            .expect(200);

          expect(blog.body).toEqual({
            id: blogId,
            ...blogsData.validBlog_4,
            createdAt: expect.any(String),
          });
        });
        it('should delete blog by id: STATUS 204', async () => {
          await request(server).delete(`/blogs/${blogId}`).expect(204);
        });
        it('shouldn`t return new blog by blogId: STATUS 404', async () => {
          const blog = await request(server)
            .get(`/blogs/${blogId}`)
            .expect(404);
        });
      });
      afterAll(async () => {
        await app.close();
      });
    });
  });
});
