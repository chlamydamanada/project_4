import { Body, Controller, Post } from '@nestjs/common';
import { loginInputModelPipe } from './pipes/loginInputDtoPipe';
import { AuthService } from '../../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async longing(@Body() loginInputDto: loginInputModelPipe) {
    const tokens = await this.authService.checkCredentials(loginInputDto);
    return tokens; // tokens.accessToken
  }
}
