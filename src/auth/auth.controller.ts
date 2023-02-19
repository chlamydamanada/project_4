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
import { AuthService } from './auth.service';
import { PasswordAuthGuard } from './guards/pass.auth.guard';
import { CurrentUserId } from './decorators/currentUserId.decorator';
import { UsersQweryRepository } from '../api/repositoriesQwery/usersQwery.repository';
import { AccessTokenGuard } from './guards/accessTokenAuth.guard';
import { userInputModelPipe } from '../api/pipes/users/userInputDtoPipe';
import { CodePipe } from './pipes/codePipe';
import { EmailPipe } from './pipes/emailPipe';
import { RefreshTokenGuard } from './guards/refreshTokenAuth.guard';
import { CurrentUserIdDeviceId } from './decorators/currentUserIdDeviceId';
import { UserIdDeviceIdType } from './types/userIdDeviceIdType';
import { NewPassRecoveryDtoPipe } from './pipes/newPassRecoveryDtoPipe';
import { AccessTokenViewType } from './types/accessTokenViewType';
import { MeViweType } from './types/meViweType';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersQweryRepository: UsersQweryRepository,
  ) {}

  @UseGuards(PasswordAuthGuard)
  @Post('login')
  async login(
    @CurrentUserId() userId: string,
    @Ip() ip: string,
    @Headers('user-agent') deviceTitle: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = await this.authService.createAccessToken(userId);
    const refreshToken = await this.authService.createRefreshTokenMeta(
      userId,
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
    return this.usersQweryRepository.getMyProfile(userId);
    // todo validation user can be undefined!?
  }

  @Post('registration')
  @HttpCode(204)
  async registration(
    @Body() userInputModel: userInputModelPipe,
  ): Promise<void> {
    await this.authService.registerUser(userInputModel);
    return;
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(@Body() codeDto: CodePipe): Promise<void> {
    await this.authService.confirmEmail(codeDto);
    return;
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(@Body() emailDto: EmailPipe): Promise<void> {
    await this.authService.checkEmailIsConfirmed(emailDto);
    return;
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  async updateTokens(
    @CurrentUserIdDeviceId() user: UserIdDeviceIdType,
    @Ip() ip: string,
    @Headers('user-agent') deviceTitle: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessTokenViewType> {
    const accessToken = await this.authService.createAccessToken(user.id);
    const refreshToken = await this.authService.updateRefreshTokenMeta(
      user.id,
      user.deviceId,
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
    @CurrentUserIdDeviceId() user: UserIdDeviceIdType,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(user.deviceId, user.id);
    response.clearCookie('refreshToken');
    return;
  }

  @Post('password-recovery')
  async passwordRecovery(@Body() emailInputDto: EmailPipe): Promise<void> {
    await this.authService.createRecoveryCode(emailInputDto);
    return;
  }

  @Post('new-password')
  @HttpCode(204)
  async newPassword(
    @Body() newPassRecoveryDto: NewPassRecoveryDtoPipe,
  ): Promise<void> {
    await this.authService.changePassword(newPassRecoveryDto);
    return;
  }
}
