import { configModule } from './configuration/configModule'; //should be first in imports
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './modules/blogs/api/blog.controller';
import { BlogsService } from './modules/blogs/application/blogs.service';
import { BlogsQweryRepository } from './modules/blogs/api/qweryRepositories/blogsQwery.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { PasswordStrategy } from './modules/auth/strategies/pass.strategy';
import { AccessTokenStrategy } from './modules/auth/strategies/accessToken.strategy';
import { MailModule } from './modules/email/email.module';
import { DeviceModel } from './modules/devices/domain/device.schema';
import { DevicesRepository } from './modules/devices/repositories/device.repository';
import { RefreshTokenStrategy } from './modules/auth/strategies/refreshToken.strategy';
import { IsBlogExistValidator } from './helpers/validators/isBlogExistById.validator';
import { ThrottlerModule } from '@nestjs/throttler';
import { CommentsRepository } from './modules/comments/repositories/comments.repository';
import { DevicesQweryRepository } from './modules/devices/api/qweryRepositories/deviceQwery.repository';
import { UsersService } from './modules/users/application/users.service';
import { PostsQweryRepository } from './modules/posts/api/qweryRepositories/postsQwery.repository';
import { CommentsController } from './modules/comments/api/comment.controller';
import { AllTestingDataController } from './modules/testingAllData/api/controllers/all-testing-data.controller';
import { UsersQweryRepository } from './modules/users/api/qweryRepositories/usersQwery.repository';
import { BlogModel } from './modules/blogs/domain/blog.schema';
import { PostsController } from './modules/posts/api/post.controller';
import { DevicesService } from './modules/devices/application/device.service';
import { UsersRepository } from './modules/users/repositories/users.repository';
import { DevicesController } from './modules/devices/api/controller/device.controller';
import { UserModel } from './modules/users/domain/user.schema';
import { UsersController } from './modules/users/api/controller/user.controller';
import { PostsService } from './modules/posts/application/posts.service';
import { CommentService } from './modules/comments/application/comments.service';
import { PostsRepository } from './modules/posts/repositories/posts.repository';
import { CommentsQweryRepository } from './modules/comments/api/qweryRepositories/commentsQwery.repository';
import { BlogsRepository } from './modules/blogs/repositories/blogs.repository';
import { StatusModel } from './modules/status/domain/status.schema';
import { PostModel } from './modules/posts/domain/post.schema';
import { CommentModel } from './modules/comments/domain/comment.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteAllDataUseCase } from './modules/testingAllData/application/deleteAllData.useCase';
import { DeleteAllDataRepository } from './modules/testingAllData/repositories/deleteAllData.repository';
import { BloggerController } from './modules/blogger/api/blogger.controller';

const services = [
  AppService,
  AuthService,
  BlogsService,
  DevicesService,
  PostsService,
  UsersService,
  CommentService,
];
const repositories = [
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
  DeleteAllDataRepository,
];
const useCases = [DeleteAllDataUseCase];
const strategies = [
  PasswordStrategy,
  AccessTokenStrategy,
  RefreshTokenStrategy,
];
const validators = [IsBlogExistValidator];

@Module({
  imports: [
    configModule,
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
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
    CqrsModule,
  ],
  controllers: [
    AppController,
    AuthController,
    BloggerController,
    BlogsController,
    PostsController,
    UsersController,
    CommentsController,
    DevicesController,
    AllTestingDataController,
  ],
  providers: [
    ...services,
    ...useCases,
    ...repositories,
    ...strategies,
    ...validators,
  ],
  //exports: [UsersRepository],
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
