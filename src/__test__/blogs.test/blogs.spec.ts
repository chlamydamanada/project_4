import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import request from 'supertest';
import { blogsData } from './blogsData';
import { useContainer } from 'class-validator';
import { HttpExceptionFilter } from '../../../exception.filter';
import { errorsData } from './errorsData';

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
          isMembership: false,
        });
      });
      it('should return new blog by blogId: STATUS 200', async () => {
        const blog = await request(server).get(`/blogs/${blogId}`).expect(200);

        expect(blog.body).toEqual({
          id: blogId,
          ...blogsData.validBlog_1,
          createdAt: expect.any(String),
          isMembership: false,
        });
      });
    });
    describe('CREATE -> GET 2 blogs with correct data and return it in view form with default pagination', () => {
      it('should create 2 blogs with correct data: STATUS 201', async () => {
        const newBlog_2 = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.validBlog_2)
          .expect(201);
        const newBlog_3 = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.validBlog_3)
          .expect(201);

        expect(newBlog_2.body).toEqual({
          id: expect.any(String),
          ...blogsData.validBlog_2,
          createdAt: expect.any(String),
          isMembership: false,
        });
        expect(newBlog_3.body).toEqual({
          id: expect.any(String),
          ...blogsData.validBlog_3,
          createdAt: expect.any(String),
          isMembership: false,
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
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_2,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_1,
              createdAt: expect.any(String),
              isMembership: false,
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
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.validBlog_4)
          .expect(201);

        blogId = newBlog.body.id;

        expect(newBlog.body).toEqual({
          id: expect.any(String),
          ...blogsData.validBlog_4,
          createdAt: expect.any(String),
          isMembership: false,
        });
      });
      it('should return new blog by blogId: STATUS 200', async () => {
        const blog = await request(server).get(`/blogs/${blogId}`).expect(200);

        expect(blog.body).toEqual({
          id: blogId,
          ...blogsData.validBlog_4,
          createdAt: expect.any(String),
          isMembership: false,
        });
      });
      it('should update blog by id with correct data: STATUS 204', async () => {
        await request(server)
          .put(`/blogs/${blogId}`)
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.validBlog_5)
          .expect(204);
      });
      it('should return updated blog: STATUS 200', async () => {
        const blog = await request(server).get(`/blogs/${blogId}`).expect(200);

        expect(blog.body).toEqual({
          id: blogId,
          ...blogsData.validBlog_5,
          createdAt: expect.any(String),
          isMembership: false,
        });
      });
    });
    describe('CREATE -> GET -> DELETE -> GET blog with correct data and return not found', () => {
      let blogId: string | null = null;
      it('should create correct blog and return it: STATUS 201', async () => {
        const newBlog = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.validBlog_4)
          .expect(201);

        blogId = newBlog.body.id;

        expect(newBlog.body).toEqual({
          id: expect.any(String),
          ...blogsData.validBlog_4,
          createdAt: expect.any(String),
          isMembership: false,
        });
      });
      it('should return new blog by blogId: STATUS 200', async () => {
        const blog = await request(server).get(`/blogs/${blogId}`).expect(200);

        expect(blog.body).toEqual({
          id: blogId,
          ...blogsData.validBlog_4,
          createdAt: expect.any(String),
          isMembership: false,
        });
      });
      it('should delete blog by id: STATUS 204', async () => {
        await request(server)
          .delete(`/blogs/${blogId}`)
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .expect(204);
      });
      it('shouldn`t return new blog by blogId: STATUS 404', async () => {
        const blog = await request(server).get(`/blogs/${blogId}`).expect(404);
      });
    });

    describe('CREATE -> GET -> check qwery: searchNameTerm, sortBy, sortDirection, pageNumber, pageSize', () => {
      it('should create correct blogs and return it: STATUS 201', async () => {
        await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`);
        await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.validBlog_4);
        await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.validBlog_6);
        await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.validBlog_7);
        await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.validBlog_8);
        await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.validBlog_9);
        await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.validBlog_10);
        await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.validBlog_11)
          .expect(201);
      });
      it('should return 11 blogs with default qwery: STATUS 200', async () => {
        const blogs = await request(server).get('/blogs').expect(200);
        expect(blogs.body).toEqual({
          pagesCount: 2,
          page: 1,
          pageSize: 10,
          totalCount: 11,
          items: expect.any(Array),
        });
      });
      it('should return 11 blogs with pageSize 2 and pageNumber 5: STATUS 200 ', async () => {
        const blogs = await request(server)
          .get('/blogs?pageSize=2&pageNumber=5')
          .expect(200);
        expect(blogs.body).toEqual({
          pagesCount: 6,
          page: 5,
          pageSize: 2,
          totalCount: 11,
          items: expect.any(Array),
        });
      });
      it('should return 11 blogs with pageSize 3 and pageNumber 2: STATUS 200 ', async () => {
        const blogs = await request(server)
          .get('/blogs?pageSize=3&pageNumber=2')
          .expect(200);
        expect(blogs.body).toEqual({
          pagesCount: 4,
          page: 2,
          pageSize: 3,
          totalCount: 11,
          items: expect.any(Array),
        });
      });
      it('should return 11 blogs with sortBy name and sortDirection asc: STATUS 200 ', async () => {
        const blogs = await request(server)
          .get('/blogs?sortBy=name&sortDirection=asc')
          .expect(200);
        expect(blogs.body).toEqual({
          pagesCount: 2,
          page: 1,
          pageSize: 10,
          totalCount: 11,
          items: [
            {
              id: expect.any(String),
              ...blogsData.validBlog_1,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_5,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_4,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_7,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_3,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_9,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_11,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_10,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_6,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_2,
              createdAt: expect.any(String),
              isMembership: false,
            },
          ],
        });
      });
      it('should return 11 blogs with sortBy name and sortDirection desc: STATUS 200', async () => {
        const blogs = await request(server)
          .get('/blogs?sortBy=name&sortDirection=desc')
          .expect(200);
        expect(blogs.body).toEqual({
          pagesCount: 2,
          page: 1,
          pageSize: 10,
          totalCount: 11,
          items: [
            {
              id: expect.any(String),
              ...blogsData.validBlog_8,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_2,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_6,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_10,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_11,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_9,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_3,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_7,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_4,
              createdAt: expect.any(String),
              isMembership: false,
            },
            {
              id: expect.any(String),
              ...blogsData.validBlog_5,
              createdAt: expect.any(String),
              isMembership: false,
            },
          ],
        });
      });
    });
    describe('not CREATE/ not UPDATE -> check validation pipes and errors messages ', () => {
      it('shouldn`t create blog with invalid name and return error message in valid form: STATUS 400 ', async () => {
        const errorName_1 = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_name_1)
          .expect(400);
        expect(errorName_1.body).toEqual(errorsData.name);

        const errorName_2 = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_name_2)
          .expect(400);
        expect(errorName_2.body).toEqual(errorsData.name);

        const errorName_3 = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_name_3)
          .expect(400);
        expect(errorName_3.body).toEqual(errorsData.name);

        const errorName_4 = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_name_4)
          .expect(400);
        expect(errorName_4.body).toEqual(errorsData.name);
      });
      it('shouldn`t create blog with invalid description and return error message in valid form: STATUS 400 ', async () => {
        const errorDescription_1 = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_description_1)
          .expect(400);
        expect(errorDescription_1.body).toEqual(errorsData.description);

        const errorDescription_2 = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_description_2)
          .expect(400);
        expect(errorDescription_2.body).toEqual(errorsData.description);

        const errorDescription_3 = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_description_3)
          .expect(400);
        expect(errorDescription_3.body).toEqual(errorsData.description);

        const errorDescription_4 = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_description_4)
          .expect(400);
        expect(errorDescription_4.body).toEqual(errorsData.description);
      });
      it('shouldn`t create blog with invalid website and return error message in valid form: STATUS 400 ', async () => {
        const errorWebsite_1 = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_website_1)
          .expect(400);
        expect(errorWebsite_1.body).toEqual(errorsData.website);

        const errorWebsite_2 = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_website_2)
          .expect(400);
        expect(errorWebsite_2.body).toEqual(errorsData.website);

        const errorWebsite_3 = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_website_3)
          .expect(400);
        expect(errorWebsite_3.body).toEqual(errorsData.website);

        const errorWebsite_4 = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_website_4)
          .expect(400);
        expect(errorWebsite_4.body).toEqual(errorsData.website);

        const errorWebsite_5 = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_website_5)
          .expect(400);
        expect(errorWebsite_5.body).toEqual(errorsData.website);
      });
      it('shouldn`t create blog with invalid name & description and return error message in valid form: STATUS 400 ', async () => {
        const errorsNameAndDescription = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_nameAndDescription)
          .expect(400);
        expect(errorsNameAndDescription.body).toEqual(
          errorsData.nameAndDescription,
        );
      });
      it('shouldn`t create blog with invalid name & website and return error message in valid form: STATUS 400 ', async () => {
        const errorsNameAndWebsite = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_nameAndWebsite)
          .expect(400);
        expect(errorsNameAndWebsite.body).toEqual(errorsData.nameAndWebsite);
      });
      it('shouldn`t create blog with invalid description & website and return error message in valid form: STATUS 400 ', async () => {
        const errorsDescriptionAndWebsite = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_descriptionAndWebsite)
          .expect(400);
        expect(errorsDescriptionAndWebsite.body).toEqual(
          errorsData.descriptionAndWebsite,
        );
      });
      it('shouldn`t create blog with invalid data and return error message in valid form: STATUS 400 ', async () => {
        const errors = await request(server)
          .post('/blogs')
          .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
          .send(blogsData.invalidBlog_allFields)
          .expect(400);
        expect(errors.body).toEqual(errorsData.allFiends);
      });
    });

    afterAll(async () => {
      await app.close();
    });
  });
});
