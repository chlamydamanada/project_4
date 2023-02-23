import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DevicesService } from '../../application/device.service';
import { DevicesQweryRepository } from '../qweryRepositories/deviceQwery.repository';
import { CurrentUserIdDeviceId } from '../../../../helpers/decorators/currentUserIdDeviceId';
import { DeviceViewType } from '../../devicesTypes/deviceViewType';
import { UserIdDeviceIdType } from '../../../auth/types/userIdDeviceIdType';
import { RefreshTokenGuard } from '../../../auth/guards/refreshTokenAuth.guard';

@Controller('security')
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    private readonly devicesQweryRepository: DevicesQweryRepository,
  ) {}

  @Get('devices')
  @UseGuards(RefreshTokenGuard)
  async getAllDevicesByUserId(
    @CurrentUserIdDeviceId() user: UserIdDeviceIdType,
  ): Promise<DeviceViewType[]> {
    const allDevices = await this.devicesQweryRepository.findDevicesByUserId(
      user.id,
    );
    if (!allDevices) throw new NotFoundException();
    return allDevices;
  }

  @Delete('devices')
  @HttpCode(204)
  @UseGuards(RefreshTokenGuard)
  async deleteAllDevicesByIdExceptThis(
    @CurrentUserIdDeviceId() user: UserIdDeviceIdType,
  ) {
    await this.devicesService.deleteAllDevicesByIdExceptThis(user);
    return;
  }

  @Delete('devices/:deviceId')
  @HttpCode(204)
  @UseGuards(RefreshTokenGuard)
  async deleteDeviceById(
    @CurrentUserIdDeviceId() user: UserIdDeviceIdType,
    @Param('deviceId') deviceId: string,
  ) {
    await this.devicesService.deleteDeviceByDeviceId(deviceId, user.id);
    return;
  }
}
