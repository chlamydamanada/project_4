import { configModule } from './configuration/configModule'; //should be first in imports
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './modules/features/public/blogs/api/blogPublic.controller';
import { BlogsQweryRepository } from './modules/features/public/blogs/api/qweryRepositories/blogsQwery.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './modules/features/public/auth/api/auth.controller';
import { PasswordStrategy } from './modules/features/public/auth/strategies/pass.strategy';
import { AccessTokenStrategy } from './modules/features/public/auth/strategies/accessToken.strategy';
import { MailModule } from './adapters/email/email.module';
import { DeviceModel } from './modules/features/public/devices/domain/device.schema';
import { DevicesRepository } from './modules/features/public/devices/repositories/device.repository';
import { RefreshTokenStrategy } from './modules/features/public/auth/strategies/refreshToken.strategy';
import { IsBlogExistValidator } from './helpers/validators/isBlogExistById.validator';
import { ThrottlerModule } from '@nestjs/throttler';
import { CommentsRepository } from './modules/features/public/comments/repositories/comments.repository';
import { DevicesQweryRepository } from './modules/features/public/devices/api/qweryRepositories/deviceQwery.repository';
import { PostsQweryRepository } from './modules/features/public/posts/api/qweryRepositories/postsQwery.repository';
import { CommentsController } from './modules/features/public/comments/api/comment.controller';
import { AllTestingDataController } from './modules/testingAllData/api/controllers/all-testing-data.controller';
import { UsersQueryRepository } from './modules/features/superAdmin/users/api/qweryRepositories/usersQwery.repository';
import { BlogModel } from './modules/features/blogger/blogs/domain/blog.schema';
import { PostsController } from './modules/features/public/posts/api/post.controller';
import { UsersRepository } from './modules/features/superAdmin/users/repositories/users.repository';
import { DevicesController } from './modules/features/public/devices/api/device.controller';
import { UserModel } from './modules/features/superAdmin/users/domain/user.schema';
import { PostsRepository } from './modules/features/blogger/posts/repositories/posts.repository';
import { CommentsQweryRepository } from './modules/features/public/comments/api/qweryRepositories/commentsQwery.repository';
import { BlogsRepository } from './modules/features/blogger/blogs/repositories/blogs.repository';
import { StatusModel } from './modules/features/public/status/domain/status.schema';
import { PostModel } from './modules/features/blogger/posts/domain/post.schema';
import { CommentModel } from './modules/features/public/comments/domain/comment.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteAllDataUseCase } from './modules/testingAllData/application/deleteAllData.useCase';
import { DeleteAllDataRepository } from './modules/testingAllData/repositories/deleteAllData.repository';
import { BloggerController } from './modules/features/blogger/blogger.controller';
import { SaController } from './modules/features/superAdmin/sa.controller';
import { CreateBlogUseCase } from './modules/features/blogger/blogs/useCases/createBlog.useCase';
import { UpdateBlogUseCase } from './modules/features/blogger/blogs/useCases/updateBlog.useCase';
import { DeleteBlogUseCase } from './modules/features/blogger/blogs/useCases/deleteBlog.useCase';
import { BlogBindToUserUseCase } from './modules/features/superAdmin/blogs/useCases/blogBindToUser.useCase';
import { CreatePostUseCase } from './modules/features/blogger/posts/useCases/createPost.useCase';
import { UpdatePostUseCase } from './modules/features/blogger/posts/useCases/updatePost.useCase';
import { DeletePostUseCase } from './modules/features/blogger/posts/useCases/deletePost.useCase';
import { GeneratePostLikeStatusUseCase } from './modules/features/public/posts/useCases/generatePostLikeStatus.useCase';
import { DeleteUserUseCase } from './modules/features/superAdmin/users/useCases/deleteUser.useCase';
import { BanOrUnbanUserUseCase } from './modules/features/superAdmin/users/useCases/banOrUnbanUser.useCase';
import { UpdateCommentUseCase } from './modules/features/public/comments/useCases/updateComment.useCase';
import { DeleteCommentUseCase } from './modules/features/public/comments/useCases/deleteComment.useCase';
import { CreateCommentUseCase } from './modules/features/public/posts/useCases/createComment.useCase';
import { GenerateCommentLikeStatusUseCase } from './modules/features/public/comments/useCases/generateCommentLikeStatus.useCase';
import { DeleteDeviceUseCase } from './modules/features/public/devices/useCases/deleteDevice.useCase';
import { DeleteAllDevicesExceptThisUseCase } from './modules/features/public/devices/useCases/deleteAllDevicesExceptThis.useCase';
import { CheckCredentialsUseCase } from './modules/features/public/auth/useCases/checkCredentials.useCase';
import { ConfirmEmailUseCase } from './modules/features/public/auth/useCases/confirmEmail.useCase';
import { CheckEmailIsConfirmedUseCase } from './modules/features/public/auth/useCases/checkEmailIsConfirmed.useCase';
import { CreateRecoveryCodeUseCase } from './modules/features/public/auth/useCases/createRecoveryCode.useCase';
import { ChangePasswordUseCase } from './modules/features/public/auth/useCases/changePassword.useCase';
import { CreateRTMetaUseCase } from './modules/features/public/auth/useCases/createRTMeta.useCase';
import { UpdateRTMetaUseCase } from './modules/features/public/auth/useCases/updateRTMeta.useCase';
import { CreateUserUseCase } from './modules/features/superAdmin/users/useCases/createUser.useCase';
import { UserRegistrationUseCase } from './modules/features/public/auth/useCases/userRegistration.useCase';
import { JwtAdapter } from './adapters/jwtAdapter';
import { BcryptAdapter } from './adapters/bcryptAdapter';
import { BanStatusModel } from './modules/features/blogger/banStatus/domain/banStatus.schema';

const services = [AppService];
const repositories = [
  BlogsQweryRepository,
  BlogsRepository,
  PostsQweryRepository,
  PostsRepository,
  CommentsQweryRepository,
  CommentsRepository,
  DevicesQweryRepository,
  DevicesRepository,
  UsersQueryRepository,
  UsersRepository,
  DeleteAllDataRepository,
];
const useCases = [
  DeleteAllDataUseCase,
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  BlogBindToUserUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  GeneratePostLikeStatusUseCase,
  DeleteUserUseCase,
  BanOrUnbanUserUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  CreateCommentUseCase,
  GenerateCommentLikeStatusUseCase,
  DeleteDeviceUseCase,
  DeleteAllDevicesExceptThisUseCase,
  CheckCredentialsUseCase,
  ConfirmEmailUseCase,
  CheckEmailIsConfirmedUseCase,
  CreateRecoveryCodeUseCase,
  ChangePasswordUseCase,
  CreateRTMetaUseCase,
  UpdateRTMetaUseCase,
  CreateUserUseCase,
  UserRegistrationUseCase,
];
const strategies = [
  PasswordStrategy,
  AccessTokenStrategy,
  RefreshTokenStrategy,
];
const validators = [IsBlogExistValidator];

const adapters = [JwtAdapter, BcryptAdapter];

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
      BanStatusModel,
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
    CommentsController,
    DevicesController,
    SaController,
    AllTestingDataController,
  ],
  providers: [
    ...services,
    ...useCases,
    ...repositories,
    ...strategies,
    ...validators,
    ...adapters,
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
