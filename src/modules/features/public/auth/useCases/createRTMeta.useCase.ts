import { UserInfoType } from '../types/userInfoType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesService } from '../../devices/application/device.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

export class CreateRTMetaCommand {
  constructor(
    public userInfo: UserInfoType,
    public ip: string,
    public deviceTitle: string,
  ) {}
}
@CommandHandler(CreateRTMetaCommand)
export class CreateRTMetaUseCase
  implements ICommandHandler<CreateRTMetaCommand>
{
  constructor(
    private readonly devicesService: DevicesService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async execute(command: CreateRTMetaCommand): Promise<string> {
    const deviceId = uuidv4();
    const token = await this.createRefreshToken(command.userInfo, deviceId);
    const tokenInfo: any = this.jwtService.decode(token);
    await this.devicesService.createDevice({
      deviceId: tokenInfo.deviceId,
      ip: command.ip,
      title: command.deviceTitle,
      userId: tokenInfo.userId,
      lastActiveDate: tokenInfo.iat!,
      expirationDate: tokenInfo.exp!,
    });
    return token;
  }
  private async createRefreshToken(
    userInfo: UserInfoType,
    deviceId: string,
  ): Promise<string> {
    const token = await this.jwtService.signAsync(
      { userId: userInfo.id, userLogin: userInfo.login, deviceId: deviceId },
      {
        expiresIn: '2000 seconds',
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      },
    );
    return token;
  }
}
