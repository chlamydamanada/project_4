import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserInfoType } from '../modules/features/public/auth/types/userInfoType';
import { AccessTokenViewType } from '../modules/features/public/auth/types/accessTokenViewType';

export class JwtAdapter {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createRefreshToken(
    userInfo: UserInfoType,
    deviceId: string,
  ): Promise<string> {
    return this.jwtService.signAsync(
      {
        userId: userInfo.id,
        userLogin: userInfo.login,
        deviceId: deviceId,
      },
      {
        expiresIn: '2000 seconds',
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      },
    );
  }

  async createAccessToken(
    userInfo: UserInfoType,
  ): Promise<AccessTokenViewType> {
    const token = await this.jwtService.signAsync(
      { userId: userInfo.id, userLogin: userInfo.login },
      {
        expiresIn: '1000 seconds',
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      },
    );
    return {
      accessToken: token,
    };
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }
}
