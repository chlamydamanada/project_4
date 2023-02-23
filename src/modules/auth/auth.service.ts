import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenViewType } from './types/accessTokenViewType';
import { v4 as uuidv4 } from 'uuid';
import { CodeType } from './types/codeType';
import { MailService } from '../email/email.service';
import { EmailType } from './types/emailType';
import { UserInputModelType } from '../users/usersTypes/userInputModelType';
import { NewPassRecoveryDtoType } from './types/newPassRecoveryDtoType';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/application/users.service';
import { UsersRepository } from '../users/repositories/users.repository';
import { DevicesService } from '../devices/application/device.service';

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

  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<null | string> {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      loginOrEmail,
    );
    if (!user) return null;
    const isMatched = await user.checkPassword(password);
    if (!isMatched) return null;
    return user._id.toString();
  }

  async createAccessToken(userId: string): Promise<AccessTokenViewType> {
    const token = await this.jwtService.signAsync(
      { userId: userId },
      {
        expiresIn: '10 seconds',
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      },
    );
    return {
      accessToken: token,
    };
  }

  async createRefreshToken(userId: string, deviceId: string): Promise<string> {
    const token = await this.jwtService.signAsync(
      { userId: userId, deviceId: deviceId },
      {
        expiresIn: '20 seconds',
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      },
    );
    return token;
  }

  async createRefreshTokenMeta(
    userId: string,
    ip: string,
    deviceTitle: string,
  ): Promise<string> {
    const deviceId = uuidv4();
    const token = await this.createRefreshToken(userId, deviceId);
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
    userId: string,
    deviceId: string,
    ip: string,
    deviceTitle: string,
  ): Promise<string> {
    const token = await this.createRefreshToken(userId, deviceId);
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
    await this.mailService.sendRegistrationEmail(
      newUser!.emailConfirmation.confirmationCode,
      newUser!.email,
    ); //todo need to delete user, if email didn't send???
    return;
  }

  async confirmEmail(codeDto: CodeType): Promise<void> {
    const user = await this.usersRepository.findUserByConfirmationCode(
      codeDto.code,
    );
    if (!user)
      throw new BadRequestException([
        {
          message: 'The confirmation code is incorrect',
          field: 'code',
        },
      ]);
    if (user.emailConfirmation.isConfirmed === true)
      throw new BadRequestException([
        {
          message: 'email is confirmed',
          field: 'code',
        },
      ]);
    if (user.emailConfirmation.expirationDate < new Date())
      throw new BadRequestException([
        {
          message: 'The confirmation code is expired',
          field: 'code',
        },
      ]);
    user.confirmEmail();
    await this.usersRepository.saveUser(user);
    return;
  }

  async checkEmailIsConfirmed(emailDto: EmailType): Promise<void> {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      emailDto.email,
    );
    if (!user) {
      throw new BadRequestException([
        {
          message: 'User not found',
          field: 'email',
        },
      ]);
    }
    if (user.emailConfirmation.isConfirmed === true) {
      throw new BadRequestException([
        {
          message: 'email already is confirmed',
          field: 'email',
        },
      ]);
    }
    user.generateNewConfirmationCode();
    await this.mailService.sendRegistrationEmail(
      user.emailConfirmation.confirmationCode,
      user.email,
    );
    await this.usersRepository.saveUser(user);
    return;
  }

  async logout(deviceId: string, userId: string): Promise<void> {
    await this.devicesService.deleteDeviceByDeviceId(deviceId, userId);
    return;
  }

  async createRecoveryCode(emailDto: EmailType): Promise<void> {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      emailDto.email,
    );
    if (!user) return;
    user.generatePasswordRecoveryCode();
    await this.mailService.sendPasswordRecoveryEmail(
      user.passwordRecoveryInfo.recoveryCode!,
      user.email,
    );
    await this.usersRepository.saveUser(user);
    return;
  }

  async changePassword(
    newPassRecoveryDto: NewPassRecoveryDtoType,
  ): Promise<void> {
    const user = await this.usersRepository.findUserByPasswordRecoveryCode(
      newPassRecoveryDto.recoveryCode,
    );
    if (!user) throw new NotFoundException('Incorrect recovery code');
    if (user.passwordRecoveryInfo.expirationDate! < new Date())
      throw new BadRequestException([
        { message: 'Recovery code is expired', field: 'recoveryCode' },
      ]);
    await user.generatePasswordHash(newPassRecoveryDto.newPassword);
    await this.usersRepository.saveUser(user);
    return;
  }
}
