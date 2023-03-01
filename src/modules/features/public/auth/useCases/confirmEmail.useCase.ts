import { CodeType } from '../types/codeType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../superAdmin/users/repositories/users.repository';
import { BadRequestException } from '@nestjs/common';

export class ConfirmEmailCommand {
  constructor(public codeDto: CodeType) {}
}
@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase
  implements ICommandHandler<ConfirmEmailCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}
  async execute(command: ConfirmEmailCommand): Promise<void> {
    const user = await this.usersRepository.findUserByConfirmationCode(
      command.codeDto.code,
    );
    if (!user)
      throw new BadRequestException([
        {
          message: 'The confirmation code is incorrect',
          field: 'code',
        },
      ]);
    if (user.emailConfirmation.isConfirmed === true)
      throw new BadRequestException([
        {
          message: 'email is confirmed',
          field: 'code',
        },
      ]);
    if (user.emailConfirmation.expirationDate < new Date())
      throw new BadRequestException([
        {
          message: 'The confirmation code is expired',
          field: 'code',
        },
      ]);
    user.confirmEmail();
    await this.usersRepository.saveUser(user);
    return;
  }
}
