import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './api/controllers/blog.controller';
import { BlogsService } from './application/blogs.service';
import { BlogsQweryRepository } from './api/repositoriesQwery/blogsQwery.repository';
import { CommentsController } from './api/controllers/comment.controller';
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
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PasswordStrategy } from './auth/strategies/pass.strategy';
import { AccessTokenStrategy } from './auth/strategies/accessTokent.strategy';
import { MailModule } from './email/email.module';
import { DeviceModel } from './domain/device.schema';
import { DevicesController } from './api/controllers/device.controller';
import { DevicesService } from './application/device.service';
import { DevicesQweryRepository } from './api/repositoriesQwery/deviceQwery.repository';
import { DevicesRepository } from './repositories/device.repository';
import { RefreshTokenStrategy } from './auth/strategies/refreshToken.strategy';
import { StatusModel } from './domain/status.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL!),
    MongooseModule.forFeature([
      BlogModel,
      PostModel,
      UserModel,
      CommentModel,
      DeviceModel,
      StatusModel,
    ]),
    PassportModule,
    MailModule, // 📧
    JwtModule.register({}),
  ],
  controllers: [
    AppController,
    AuthController,
    BlogsController,
    PostsController,
    UsersController,
    CommentsController,
    DevicesController,
    AllTestingDataController,
  ],
  providers: [
    AppService,
    AuthService,
    PasswordStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    BlogsService,
    DevicesService,
    PostsService,
    UsersService,
    CommentService,
    BlogsQweryRepository,
    BlogsRepository,
    PostsQweryRepository,
    PostsRepository,
    CommentsQweryRepository,
    CommentsRepository,
    DevicesQweryRepository,
    DevicesRepository,
    UsersQweryRepository,
    UsersRepository,
  ],
  exports: [UsersRepository],
})
export class AppModule {}
/*implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(ExtractATMiddleware)
      .forRoutes(
        { path: 'comments/:id', method: RequestMethod.GET },
        { path: 'posts', method: RequestMethod.GET },
        { path: 'posts/:id', method: RequestMethod.GET },
        { path: 'posts/:postId/comments', method: RequestMethod.GET },
        { path: 'blogs/:blogId/posts', method: RequestMethod.GET },
      );
  }
}*/
