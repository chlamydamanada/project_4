import { EmailType } from '../types/emailType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../superAdmin/users/repositories/users.repository';
import { MailService } from '../../../../../adapters/email/email.service';

export class CreateRecoveryCodeCommand {
  constructor(public emailDto: EmailType) {}
}
@CommandHandler(CreateRecoveryCodeCommand)
export class CreateRecoveryCodeUseCase
  implements ICommandHandler<CreateRecoveryCodeCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
  ) {}
  async execute(command: CreateRecoveryCodeCommand): Promise<void> {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      command.emailDto.email,
    );
    if (!user) return;
    user.generatePasswordRecoveryCode();
    await this.mailService.sendPasswordRecoveryEmail(
      user.passwordRecoveryInfo.recoveryCode!,
      user.email,
    );
    await this.usersRepository.saveUser(user);
    return;
  }
}
