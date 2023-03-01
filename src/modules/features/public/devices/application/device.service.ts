import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateDeviceDtoType } from '../devicesTypes/updateDeviceDtoType';
import { CreateDeviceDtoType } from '../devicesTypes/createDeviceDtoType';
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
}
