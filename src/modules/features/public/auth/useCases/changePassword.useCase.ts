import { NewPassRecoveryDtoType } from '../types/newPassRecoveryDtoType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../superAdmin/users/repositories/users.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class ChangePasswordCommand {
  constructor(public newPassRecoveryDto: NewPassRecoveryDtoType) {}
}
@CommandHandler(ChangePasswordCommand)
export class ChangePasswordUseCase
  implements ICommandHandler<ChangePasswordCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}
  async execute(command: ChangePasswordCommand): Promise<void> {
    const user = await this.usersRepository.findUserByPasswordRecoveryCode(
      command.newPassRecoveryDto.recoveryCode,
    );
    if (!user) throw new NotFoundException('Incorrect recovery code');
    if (user.passwordRecoveryInfo.expirationDate! < new Date())
      throw new BadRequestException([
        { message: 'Recovery code is expired', field: 'recoveryCode' },
      ]);
    await user.generatePasswordHash(command.newPassRecoveryDto.newPassword);
    await this.usersRepository.saveUser(user);
    return;
  }
}
