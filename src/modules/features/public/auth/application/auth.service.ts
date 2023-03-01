import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../../../../email/email.service';
import { UserInputModelType } from '../../../superAdmin/users/usersTypes/userInputModelType';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../../superAdmin/users/application/users.service';
import { UsersRepository } from '../../../superAdmin/users/repositories/users.repository';
import { DevicesService } from '../../devices/application/device.service';
import { UserInfoType } from '../types/userInfoType';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
    private readonly devicesService: DevicesService,
    private configService: ConfigService,
  ) {}

  async createRefreshToken(
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

  async createRefreshTokenMeta(
    userInfo: UserInfoType,
    ip: string,
    deviceTitle: string,
  ): Promise<string> {
    const deviceId = uuidv4();
    const token = await this.createRefreshToken(userInfo, deviceId);
    const tokenInfo: any = this.jwtService.decode(token);
    await this.devicesService.createDevice({
      deviceId: tokenInfo.deviceId,
      ip: ip,
      title: deviceTitle,
      userId: tokenInfo.userId,
      lastActiveDate: tokenInfo.iat!,
      expirationDate: tokenInfo.exp!,
    });
    return token;
  }

  async updateRefreshTokenMeta(
    userInfo: UserInfoType,
    deviceId: string,
    ip: string,
    deviceTitle: string,
  ): Promise<string> {
    const token = await this.createRefreshToken(userInfo, deviceId);
    const tokenInfo: any = this.jwtService.decode(token);
    await this.devicesService.updateDevice({
      deviceId: tokenInfo.deviceId,
      ip: ip,
      title: deviceTitle,
      lastActiveDate: tokenInfo.iat!,
      expirationDate: tokenInfo.exp!,
    });
    return token;
  }

  async registerUser(userInputModel: UserInputModelType): Promise<void> {
    const newUserId = await this.usersService.createUser(userInputModel);
    const newUser = await this.usersRepository.findUserById(newUserId);
    if (!newUser) throw new NotFoundException();
    await this.mailService.sendRegistrationEmail(
      newUser!.emailConfirmation.confirmationCode,
      newUser!.email,
    );
    return;
  }
}
