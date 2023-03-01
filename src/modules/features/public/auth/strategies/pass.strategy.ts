import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { LoginDto } from '../../../../../helpers/validators/pass.validator';
import { validate } from 'class-validator';
import { CommandBus } from '@nestjs/cqrs';
import { CheckCredentialsCommand } from '../useCases/checkCredentials.useCase';

@Injectable()
export class PasswordStrategy extends PassportStrategy(Strategy) {
  constructor(private commandBus: CommandBus) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<{ id: string } | any> {
    const loginDto = new LoginDto();
    loginDto.password = password;
    loginDto.loginOrEmail = loginOrEmail;

    const errors = await validate(loginDto);
    if (errors.length > 0)
      throw new BadRequestException(
        errors.map((e) => ({
          message: Object.values(e.constraints!)[0],
          field: e.property,
        })),
      );

    const userInfo = await this.commandBus.execute(
      new CheckCredentialsCommand(loginDto.loginOrEmail, loginDto.password),
    );

    if (!userInfo) throw new UnauthorizedException();
    return userInfo;
  }
}
