import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginDto } from '../../helpers/validators/pass.validator';
import { validate, validateOrReject } from 'class-validator';

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
    /*if (
      !loginOrEmail ||
      typeof loginOrEmail !== 'string' ||
      loginOrEmail.length > 50 ||
      !loginOrEmail.trim()
    )
      throw new BadRequestException([
        {
          message: 'loginOrEmail is incorrect',
          field: 'loginOrEmail',
        },
      ]);
    if (
      !password ||
      typeof password !== 'string' ||
      password.length > 20 ||
      !password.trim()
    )
      throw new BadRequestException([
        {
          message: 'password is incorrect',
          field: 'password',
        },
      ]);*/

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

    const userId = await this.authService.checkCredentials(
      loginDto.loginOrEmail,
      loginDto.password,
    );
    if (!userId) throw new UnauthorizedException();
    return { id: userId };
  }
}
