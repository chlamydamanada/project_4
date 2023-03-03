import { UserDtoType } from '../usersTypes/userInputModelType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../repositories/users.repository';
import { BadRequestException } from '@nestjs/common';
import { BadRequestError } from '../../../../../helpers/errorHelper/badRequestError';

export class CreateUserCommand {
  constructor(public userDto: UserDtoType) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly usersRepository: UsersRepository) {}
  async execute(command: CreateUserCommand): Promise<string> {
    const isExistByLogin = await this.usersRepository.findUserByLoginOrEmail(
      command.userDto.login,
    );
    if (isExistByLogin)
      throw new BadRequestException([
        new BadRequestError('login'),
        //{ message: 'login already exist',
        //  field: 'login',},
      ]);
    const isExistByEmail = await this.usersRepository.findUserByLoginOrEmail(
      command.userDto.email,
    );
    if (isExistByEmail)
      throw new BadRequestException([
        {
          message: 'Email already exist',
          field: 'email',
        },
      ]);
    const newUser = this.usersRepository.getUserEntity();
    await newUser.createUser(command.userDto);
    const newUserId = await this.usersRepository.saveUser(newUser);
    return newUserId;
  }
}
