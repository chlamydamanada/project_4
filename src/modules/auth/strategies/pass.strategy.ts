import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../application/auth.service';
import { LoginDto } from '../../../helpers/validators/pass.validator';
import { validate } from 'class-validator';

@Injectable()
export class PasswordStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
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

    const userInfo = await this.authService.checkCredentials(
      loginDto.loginOrEmail,
      loginDto.password,
    );
    if (!userInfo) throw new UnauthorizedException();
    return userInfo;
  }
}
