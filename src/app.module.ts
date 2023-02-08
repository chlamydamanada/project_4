import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './api/controllers/blog.controller';
import { BlogsService } from './application/blogs.service';
import { BlogsQweryRepository } from './api/repositoriesQwery/blogsQwery.repository';
import { CommentsContoller } from './api/controllers/comment.controller';
import { PostsController } from './api/controllers/post.controller';
import { UsersController } from './api/controllers/user.controller';
import { UsersService } from './application/users.service';
import { UsersQweryRepository } from './api/repositoriesQwery/usersQwery.repository';
import { UsersRepository } from './repositories/users.repository';
import { PostsService } from './application/posts.service';
import { PostsQweryRepository } from './api/repositoriesQwery/postsQwery.repository';
import { CommentsQweryRepository } from './api/repositoriesQwery/commentsQwery.repository';
import { BlogModel } from './domain/blog.schema';
import { BlogsRepository } from './repositories/blogs.repository';
import { PostModel } from './domain/post.schema';
import { UserModel } from './domain/user.schema';
import { CommentModel } from './domain/comment.schema';
import { PostsRepository } from './repositories/posts.repository';
import { AllTestingDataController } from './api/controllers/all-testing-data.controller';
import { CommentService } from './application/comments.service';
import { CommentsRepository } from './repositories/comments.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL!),
    MongooseModule.forFeature([BlogModel, PostModel, UserModel, CommentModel]),
  ],
  controllers: [
    AppController,
    BlogsController,
    PostsController,
    UsersController,
    CommentsContoller,
    AllTestingDataController,
  ],
  providers: [
    AppService,
    BlogsService,
    PostsService,
    UsersService,
    CommentService,
    BlogsQweryRepository,
    BlogsRepository,
    PostsQweryRepository,
    PostsRepository,
    CommentsQweryRepository,
    CommentsRepository,
    UsersQweryRepository,
    UsersRepository,
  ],
})
export class AppModule {}
