import { UserDtoType } from '../../../superAdmin/users/usersTypes/userInputModelType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../superAdmin/users/repositories/users.repository';
import { MailService } from '../../../../../adapters/email/email.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BadRequestError } from '../../../../../helpers/errorHelper/badRequestError';

export class UserRegistrationCommand {
  constructor(public userDto: UserDtoType) {}
}
@CommandHandler(UserRegistrationCommand)
export class UserRegistrationUseCase
  implements ICommandHandler<UserRegistrationCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
  ) {}
  async execute(command: UserRegistrationCommand): Promise<void> {
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
    await this.usersRepository.saveUser(newUser);
    await this.mailService.sendRegistrationEmail(
      newUser.emailConfirmation.confirmationCode,
      newUser.email,
    );
    return;
  }
}
