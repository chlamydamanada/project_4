import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateDeviceDtoType } from '../devicesTypes/updateDeviceDtoType';
import { CreateDeviceDtoType } from '../devicesTypes/createDeviceDtoType';
import { UserIdDeviceIdType } from '../../auth/types/userIdDeviceIdType';
import { DevicesRepository } from '../repositories/device.repository';

@Injectable()
export class DevicesService {
  constructor(private readonly devicesRepository: DevicesRepository) {}

  async createDevice(deviceDto: CreateDeviceDtoType): Promise<string> {
    const newDevice = this.devicesRepository.getDeviceEntity();
    newDevice.createDevice(deviceDto);
    const newDeviceId = await this.devicesRepository.saveDevice(newDevice);
    return newDeviceId;
  }

  async updateDevice(deviceDto: UpdateDeviceDtoType): Promise<void> {
    const device = await this.devicesRepository.findDeviceByDeviceId(
      deviceDto.deviceId,
    );
    if (!device) throw new NotFoundException('device not found');
    device.updateDevice(deviceDto);
    await this.devicesRepository.saveDevice(device);
    return;
  }

  async deleteDeviceByDeviceId(
    deviceId: string,
    userId: string,
  ): Promise<void> {
    const device = await this.devicesRepository.findDeviceByDeviceId(deviceId);
    if (!device) throw new NotFoundException('device not found');
    if (userId !== device.userId)
      throw new ForbiddenException(
        'You try to delete the device of other user',
      );
    await this.devicesRepository.deleteDeviceByDeviceId(deviceId);
    return;
  }

  async deleteAllDevicesByIdExceptThis(user: UserIdDeviceIdType) {
    await this.devicesRepository.deleteAllDevicesByIdExceptThis(user);
    return;
  }
}
