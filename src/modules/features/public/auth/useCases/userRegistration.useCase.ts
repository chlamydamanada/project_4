import { UserDtoType } from '../../../superAdmin/users/usersTypes/userDtoType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../superAdmin/users/repositories/users.repository';
import { MailService } from '../../../../../adapters/email/email.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BadRequestError } from '../../../../../helpers/errorHelper/badRequestError';
import { BcryptAdapter } from '../../../../../adapters/bcryptAdapter';

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
    private readonly bcryptAdapter: BcryptAdapter,
  ) {}
  async execute(command: UserRegistrationCommand): Promise<void> {
    // check exist user by login or email
    const isUserExist = await this.usersRepository.isUserExist(
      command.userDto.login,
      command.userDto.email,
    );
    // one user can`t be registered twice
    if (isUserExist.isExist)
      throw new BadRequestException([new BadRequestError(isUserExist.field)]);
    //generate hash
    const passwordHash = await this.bcryptAdapter.generatePasswordHash(
      command.userDto.password,
    );
    //create user entity
    const newUser = this.usersRepository.getUserEntity(
      command.userDto.login,
      command.userDto.email,
      passwordHash,
    );
    await this.usersRepository.saveUser(newUser);
    //send confirmation code to user email
    await this.mailService.sendRegistrationEmail(
      newUser.emailConfirmation.confirmationCode,
      newUser.email,
    );
    return;
  }
}
