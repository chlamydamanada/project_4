import { NewPassRecoveryDtoType } from '../types/newPassRecoveryDtoType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../superAdmin/users/repositories/users.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BcryptAdapter } from '../../../../../adapters/bcryptAdapter';

export class ChangePasswordCommand {
  constructor(public newPassRecoveryDto: NewPassRecoveryDtoType) {}
}
@CommandHandler(ChangePasswordCommand)
export class ChangePasswordUseCase
  implements ICommandHandler<ChangePasswordCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptAdapter: BcryptAdapter,
  ) {}
  async execute(command: ChangePasswordCommand): Promise<void> {
    const user = await this.usersRepository.findUserByPasswordRecoveryCode(
      command.newPassRecoveryDto.recoveryCode,
    );
    if (!user) throw new NotFoundException('Incorrect recovery code');
    if (user.passwordRecoveryInfo.expirationDate! < new Date())
      throw new BadRequestException([
        { message: 'Recovery code is expired', field: 'recoveryCode' },
      ]);
    const passwordHash = await this.bcryptAdapter.generatePasswordHash(
      command.newPassRecoveryDto.newPassword,
    );
    await user.changePasswordHash(passwordHash);
    await this.usersRepository.saveUser(user);
    return;
  }
}
