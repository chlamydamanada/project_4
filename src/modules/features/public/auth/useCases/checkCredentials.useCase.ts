import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../superAdmin/users/repositories/users.repository';
import { UserInfoType } from '../types/userInfoType';
import { BcryptAdapter } from '../../../../../adapters/bcryptAdapter';

export class CheckCredentialsCommand {
  constructor(public loginOrEmail: string, public password: string) {}
}
@CommandHandler(CheckCredentialsCommand)
export class CheckCredentialsUseCase
  implements ICommandHandler<CheckCredentialsCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptAdapter: BcryptAdapter,
  ) {}
  async execute(
    command: CheckCredentialsCommand,
  ): Promise<null | UserInfoType> {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      command.loginOrEmail,
    ); // check there is user or not
    if (!user) return null;
    //check user password
    const isMatched = await this.bcryptAdapter.checkPassword(
      command.password,
      user.passwordHash,
    );
    if (!isMatched) return null;
    // check is user banned or not
    if (user.banInfo.isBanned) return null;
    return {
      id: user._id.toString(),
      login: user.login,
    };
  }
}
