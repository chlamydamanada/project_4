import { UserInfoType } from '../types/userInfoType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { CreateDeviceDtoType } from '../../devices/devicesTypes/createDeviceDtoType';
import { DevicesRepository } from '../../devices/repositories/device.repository';
import { JwtAdapter } from '../../../../../adapters/jwtAdapter';

export class CreateRTMetaCommand {
  constructor(
    public userInfo: UserInfoType,
    public ip: string,
    public deviceTitle: string,
  ) {}
}
@CommandHandler(CreateRTMetaCommand)
export class CreateRTMetaUseCase
  implements ICommandHandler<CreateRTMetaCommand>
{
  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly devicesRepository: DevicesRepository,
  ) {}
  async execute(command: CreateRTMetaCommand): Promise<string> {
    const deviceId = uuidv4();
    //  create refresh token
    const token = await this.jwtAdapter.createRefreshToken(
      command.userInfo,
      deviceId,
    );
    // decode token to take iat and exp
    const tokenInfo: any = this.jwtAdapter.decodeToken(token);
    // create device session
    await this.createDevice({
      deviceId: tokenInfo.deviceId,
      ip: command.ip,
      title: command.deviceTitle,
      userId: tokenInfo.userId,
      lastActiveDate: tokenInfo.iat!,
      expirationDate: tokenInfo.exp!,
    });
    return token;
  }

  private async createDevice(deviceDto: CreateDeviceDtoType): Promise<string> {
    const newDevice = this.devicesRepository.getDeviceEntity();
    newDevice.createDevice(deviceDto);
    const newDeviceId = await this.devicesRepository.saveDevice(newDevice);
    return newDeviceId;
  }
}
