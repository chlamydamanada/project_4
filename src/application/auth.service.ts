import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loginInputDtoType } from '../types/authTypes/loginInputDtoType';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async checkCredentials(loginInputDto: loginInputDtoType) {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      loginInputDto.loginOrEmail,
    );
    if (!user)
      throw new UnauthorizedException('The password or login is wrong');
    const isCorrectPass = user.checkPassword(loginInputDto.password);
    if (!isCorrectPass)
      throw new UnauthorizedException('*The password or login is wrong');
    return true;
  }
}
