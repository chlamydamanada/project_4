import {
  Controller,
  Ip,
  Post,
  Headers,
  UseGuards,
  Res,
  Get,
  Body,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { PasswordAuthGuard } from '../guards/pass.auth.guard';
import { CurrentUserId } from '../../../../../helpers/decorators/currentUserId.decorator';
import { AccessTokenGuard } from '../guards/accessTokenAuth.guard';
import { CodePipe } from './pipes/codePipe';
import { EmailPipe } from './pipes/emailPipe';
import { RefreshTokenGuard } from '../guards/refreshTokenAuth.guard';
import { CurrentUserInfoAndDeviceId } from '../../../../../helpers/decorators/currentUserIdDeviceId';
import { UserInfoRtType } from '../types/userIdDeviceIdType';
import { NewPassRecoveryDtoPipe } from './pipes/newPassRecoveryDtoPipe';
import { AccessTokenViewType } from '../types/accessTokenViewType';
import { MeViweType } from '../types/meViweType';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UsersQueryRepository } from '../../../superAdmin/users/api/qweryRepositories/usersQwery.repository';
import { userInputModelPipe } from '../../../superAdmin/users/api/pipes/userInputDtoPipe';
import { CurrentUserInfo } from '../../../../../helpers/decorators/currentUserIdAndLogin';
import { UserInfoType } from '../types/userInfoType';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteDeviceCommand } from '../../devices/useCases/deleteDevice.useCase';
import { ConfirmEmailCommand } from '../useCases/confirmEmail.useCase';
import { CheckEmailIsConfirmedCommand } from '../useCases/checkEmailIsConfirmed.useCase';
import { CreateRecoveryCodeCommand } from '../useCases/createRecoveryCode.useCase';
import { ChangePasswordCommand } from '../useCases/changePassword.useCase';
import { CreateRTMetaCommand } from '../useCases/createRTMeta.useCase';
import { UpdateRTMetaCommand } from '../useCases/updateRTMeta.useCase';
import { JwtAdapter } from '../../../../../adapters/jwtAdapter';
import { UserRegistrationCommand } from '../useCases/userRegistration.useCase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly jwtAdapter: JwtAdapter,
    private commandBus: CommandBus,
  ) {}

  @Post('login')
  //@UseGuards(ThrottlerGuard)
  @UseGuards(PasswordAuthGuard)
  @HttpCode(200)
  async login(
    @CurrentUserInfo() userInfo: UserInfoType,
    @Ip() ip: string,
    @Headers('user-agent') deviceTitle: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.commandBus.execute(
      new CreateRTMetaCommand(userInfo, ip, deviceTitle),
    );
    console.log('refreshToken:', tokens.refreshToken);
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return tokens.accessToken;
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getMyProfile(
    @CurrentUserId() userId: string,
  ): Promise<MeViweType | undefined> {
    return this.usersQueryRepository.getMyProfile(userId);
    // todo validation user can be undefined!?
  }

  @Post('registration')
  //@UseGuards(ThrottlerGuard)
  @HttpCode(204)
  async registration(
    @Body() userInputModel: userInputModelPipe,
  ): Promise<void> {
    await this.commandBus.execute(new UserRegistrationCommand(userInputModel));
    return;
  }

  @Post('registration-confirmation')
  //@UseGuards(ThrottlerGuard)
  @HttpCode(204)
  async registrationConfirmation(@Body() codeDto: CodePipe): Promise<void> {
    await this.commandBus.execute(new ConfirmEmailCommand(codeDto));
    return;
  }

  @Post('registration-email-resending')
  //@UseGuards(ThrottlerGuard)
  @HttpCode(204)
  async registrationEmailResending(@Body() emailDto: EmailPipe): Promise<void> {
    await this.commandBus.execute(new CheckEmailIsConfirmedCommand(emailDto));
    return;
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  async updateTokens(
    @CurrentUserInfoAndDeviceId() userInfo: UserInfoRtType,
    @Ip() ip: string,
    @Headers('user-agent') deviceTitle: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessTokenViewType> {
    const tokens = await this.commandBus.execute(
      new UpdateRTMetaCommand(
        {
          id: userInfo.id,
          login: userInfo.login,
        },
        userInfo.deviceId,
        ip,
        deviceTitle,
      ),
    );
    console.log(tokens.refreshToken);
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return tokens.accessToken;
  }

  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async logout(
    @CurrentUserInfoAndDeviceId() userInfo: UserInfoRtType,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.commandBus.execute(
      new DeleteDeviceCommand(userInfo.deviceId, userInfo.id),
    );
    response.clearCookie('refreshToken');
    return;
  }

  @Post('password-recovery')
  //@UseGuards(ThrottlerGuard)
  async passwordRecovery(@Body() emailInputDto: EmailPipe): Promise<void> {
    await this.commandBus.execute(new CreateRecoveryCodeCommand(emailInputDto));
    return;
  }

  @Post('new-password')
  //@UseGuards(ThrottlerGuard)
  @HttpCode(204)
  async newPassword(
    @Body() newPassRecoveryDto: NewPassRecoveryDtoPipe,
  ): Promise<void> {
    await this.commandBus.execute(
      new ChangePasswordCommand(newPassRecoveryDto),
    );
    return;
  }
}
