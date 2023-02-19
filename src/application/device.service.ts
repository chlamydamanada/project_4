import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DevicesRepository } from '../repositories/device.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device, DeviceEntity } from '../domain/device.schema';
import { CreateDeviceDtoType } from '../types/devices/createDeviceDtoType';
import { UpdateDeviceDtoType } from '../types/devices/updateDeviceDtoType';
import { UserIdDeviceIdType } from '../auth/types/userIdDeviceIdType';

@Injectable()
export class DevicesService {
  constructor(
    private readonly devicesRepository: DevicesRepository,
    @InjectModel(Device.name) private deviceModel: Model<DeviceEntity>,
  ) {}

  async createDevice(deviceDto: CreateDeviceDtoType): Promise<string> {
    const newDevice = new this.deviceModel();
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
