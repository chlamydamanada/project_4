import { UserInfoType } from '../types/userInfoType';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../devices/repositories/device.repository';
import { UpdateDeviceDtoType } from '../../devices/devicesTypes/updateDeviceDtoType';
import { NotFoundException } from '@nestjs/common';
import { JwtAdapter } from '../../../../../adapters/jwtAdapter';
import { TokensType } from '../types/tokensType';

export class UpdateRTMetaCommand {
  constructor(
    public userInfo: UserInfoType,
    public deviceId: string,
    public ip: string,
    public deviceTitle: string,
  ) {}
}
@CommandHandler(UpdateRTMetaCommand)
export class UpdateRTMetaUseCase
  implements ICommandHandler<UpdateRTMetaCommand>
{
  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly devicesRepository: DevicesRepository,
  ) {}
  async execute(command: UpdateRTMetaCommand): Promise<TokensType> {
    // create refresh token
    const refreshToken = await this.jwtAdapter.createRefreshToken(
      command.userInfo,
      command.deviceId,
    );
    // create access token
    const accessToken = await this.jwtAdapter.createAccessToken(
      command.userInfo,
    );
    // decode token to take iat and exp
    const tokenInfo: any = this.jwtAdapter.decodeToken(refreshToken);
    // update device session
    await this.updateDevice({
      deviceId: tokenInfo.deviceId,
      ip: command.ip,
      title: command.deviceTitle,
      lastActiveDate: tokenInfo.iat!,
      expirationDate: tokenInfo.exp!,
    });
    return { refreshToken, accessToken };
  }
  private async updateDevice(deviceDto: UpdateDeviceDtoType): Promise<void> {
    const device = await this.devicesRepository.findDeviceByDeviceId(
      deviceDto.deviceId,
    );
    if (!device) throw new NotFoundException('device not found');
    device.updateDevice(deviceDto);
    await this.devicesRepository.saveDevice(device);
    return;
  }
}
