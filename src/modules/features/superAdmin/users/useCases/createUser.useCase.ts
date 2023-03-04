import { UserDtoType } from '../usersTypes/userDtoType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../repositories/users.repository';
import { BadRequestException } from '@nestjs/common';
import { BadRequestError } from '../../../../../helpers/errorHelper/badRequestError';
import { BcryptAdapter } from '../../../../../adapters/bcryptAdapter';

export class CreateUserCommand {
  constructor(public userDto: UserDtoType) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptAdapter: BcryptAdapter,
  ) {}
  async execute(command: CreateUserCommand): Promise<string> {
    // check exist user by login or email
    const isUserExist = await this.usersRepository.isUserExist(
      command.userDto.login,
      command.userDto.email,
    );
    // one user can`t be created twice
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
    // user created by super admin should be confirmed
    await newUser.confirmEmail();
    const newUserId = await this.usersRepository.saveUser(newUser);
    return newUserId;
  }
}
