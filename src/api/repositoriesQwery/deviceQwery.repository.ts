import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceEntity } from '../../domain/device.schema';
import { Model } from 'mongoose';
import { DeviceViewType } from '../../types/devices/deviceViewType';

@Injectable()
export class DevicesQweryRepository {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceEntity>,
  ) {}

  async findDevicesByUserId(userId: string): Promise<DeviceViewType[] | null> {
    const allDevices = await this.deviceModel.find({ userId: userId }).lean();
    if (!allDevices) return null;
    return allDevices.map((d) => ({
      ip: d.ip,
      title: d.title,
      lastActiveDate: new Date(d.lastActiveDate * 1000).toISOString(),
      deviceId: d.deviceId,
    }));
  }
}
