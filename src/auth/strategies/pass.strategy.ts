import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

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
  ): Promise<{ id: string }> {
    if (
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
      ]);
    const userId = await this.authService.checkCredentials(
      loginOrEmail,
      password,
    );
    if (!userId) throw new UnauthorizedException();
    return { id: userId };
  }
}
