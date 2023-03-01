import { UserInfoType } from '../types/userInfoType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenViewType } from '../types/accessTokenViewType';
import { ConfigService } from '@nestjs/config';

export class CreateATCommand {
  constructor(public userInfo: UserInfoType) {}
}

@CommandHandler(CreateATCommand)
export class CreateATUseCase implements ICommandHandler<CreateATCommand> {
  constructor(
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async execute(command: CreateATCommand): Promise<AccessTokenViewType> {
    const token = await this.jwtService.signAsync(
      { userId: command.userInfo.id, userLogin: command.userInfo.login },
      {
        expiresIn: '1000 seconds',
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      },
    );
    return {
      accessToken: token,
    };
  }
}
