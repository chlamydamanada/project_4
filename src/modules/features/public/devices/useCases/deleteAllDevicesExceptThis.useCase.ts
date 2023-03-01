import { UserInfoRtType } from '../../auth/types/userIdDeviceIdType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../repositories/device.repository';

export class DeleteAllDevicesExceptThisCommand {
  constructor(public user: UserInfoRtType) {}
}
@CommandHandler(DeleteAllDevicesExceptThisCommand)
export class DeleteAllDevicesExceptThisUseCase
  implements ICommandHandler<DeleteAllDevicesExceptThisCommand>
{
  constructor(private readonly devicesRepository: DevicesRepository) {}
  async execute(command: DeleteAllDevicesExceptThisCommand) {
    await this.devicesRepository.deleteAllDevicesByIdExceptThis(command.user);
    return;
  }
}
