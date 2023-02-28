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
import { AuthService } from '../application/auth.service';
import { PasswordAuthGuard } from '../guards/pass.auth.guard';
import { CurrentUserId } from '../../../helpers/decorators/currentUserId.decorator';
import { AccessTokenGuard } from '../guards/accessTokenAuth.guard';
import { CodePipe } from './pipes/codePipe';
import { EmailPipe } from './pipes/emailPipe';
import { RefreshTokenGuard } from '../guards/refreshTokenAuth.guard';
import { CurrentUserInfoAndDeviceId } from '../../../helpers/decorators/currentUserIdDeviceId';
import { UserInfoRtType } from '../types/userIdDeviceIdType';
import { NewPassRecoveryDtoPipe } from './pipes/newPassRecoveryDtoPipe';
import { AccessTokenViewType } from '../types/accessTokenViewType';
import { MeViweType } from '../types/meViweType';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UsersQueryRepository } from '../../users/api/qweryRepositories/usersQwery.repository';
import { userInputModelPipe } from '../../users/api/pipes/userInputDtoPipe';
import { CurrentUserInfo } from '../../../helpers/decorators/currentUserIdAndLogin';
import { UserInfoType } from '../types/userInfoType';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post('login')
  @UseGuards(/*ThrottlerGuard,*/ PasswordAuthGuard)
  @HttpCode(200)
  async login(
    @CurrentUserInfo() userInfo: UserInfoType,
    @Ip() ip: string,
    @Headers('user-agent') deviceTitle: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = await this.authService.createAccessToken(userInfo);
    const refreshToken = await this.authService.createRefreshTokenMeta(
      userInfo,
      ip,
      deviceTitle,
    );
    console.log('refreshToken:', refreshToken);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return accessToken;
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
    await this.authService.registerUser(userInputModel);
    return;
  }

  @Post('registration-confirmation')
  //@UseGuards(ThrottlerGuard)
  @HttpCode(204)
  async registrationConfirmation(@Body() codeDto: CodePipe): Promise<void> {
    await this.authService.confirmEmail(codeDto);
    return;
  }

  @Post('registration-email-resending')
  //@UseGuards(ThrottlerGuard)
  @HttpCode(204)
  async registrationEmailResending(@Body() emailDto: EmailPipe): Promise<void> {
    await this.authService.checkEmailIsConfirmed(emailDto);
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
    const accessToken = await this.authService.createAccessToken({
      id: userInfo.id,
      login: userInfo.login,
    });
    const refreshToken = await this.authService.updateRefreshTokenMeta(
      {
        id: userInfo.id,
        login: userInfo.login,
      },
      userInfo.deviceId,
      ip,
      deviceTitle,
    );
    console.log(refreshToken);
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return accessToken;
  }

  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async logout(
    @CurrentUserInfoAndDeviceId() userInfo: UserInfoRtType,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(userInfo.deviceId, userInfo.id);
    response.clearCookie('refreshToken');
    return;
  }

  @Post('password-recovery')
  //@UseGuards(ThrottlerGuard)
  async passwordRecovery(@Body() emailInputDto: EmailPipe): Promise<void> {
    await this.authService.createRecoveryCode(emailInputDto);
    return;
  }

  @Post('new-password')
  //@UseGuards(ThrottlerGuard)
  @HttpCode(204)
  async newPassword(
    @Body() newPassRecoveryDto: NewPassRecoveryDtoPipe,
  ): Promise<void> {
    await this.authService.changePassword(newPassRecoveryDto);
    return;
  }
}
