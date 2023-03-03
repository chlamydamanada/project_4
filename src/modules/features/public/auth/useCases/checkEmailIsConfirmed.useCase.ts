import { EmailType } from '../types/emailType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../superAdmin/users/repositories/users.repository';
import { MailService } from '../../../../../adapters/email/email.service';
import { BadRequestException } from '@nestjs/common';

export class CheckEmailIsConfirmedCommand {
  constructor(public emailDto: EmailType) {}
}
@CommandHandler(CheckEmailIsConfirmedCommand)
export class CheckEmailIsConfirmedUseCase
  implements ICommandHandler<CheckEmailIsConfirmedCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
  ) {}
  async execute(command: CheckEmailIsConfirmedCommand): Promise<void> {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      command.emailDto.email,
    );
    if (!user) {
      throw new BadRequestException([
        {
          message: 'User not found',
          field: 'email',
        },
      ]);
    }
    if (user.emailConfirmation.isConfirmed === true) {
      throw new BadRequestException([
        {
          message: 'email already is confirmed',
          field: 'email',
        },
      ]);
    }
    user.generateNewConfirmationCode();
    await this.mailService.sendRegistrationEmail(
      user.emailConfirmation.confirmationCode,
      user.email,
    );
    await this.usersRepository.saveUser(user);
    return;
  }
}
