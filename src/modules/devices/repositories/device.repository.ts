import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceEntity } from '../domain/device.schema';
import { Model } from 'mongoose';
import { UserInfoRtType } from '../../auth/types/userIdDeviceIdType';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceEntity>,
  ) {}

  getDeviceEntity() {
    return new this.deviceModel();
  }

  async saveDevice(device: DeviceEntity): Promise<string> {
    const newDevice = await device.save();
    return newDevice._id.toString();
  }

  async findDeviceByDeviceId(deviceId: string): Promise<DeviceEntity | null> {
    const device = await this.deviceModel.findOne({
      deviceId: deviceId,
    });
    return device;
  }

  async deleteDeviceByDeviceId(deviceId: string): Promise<void> {
    await this.deviceModel.deleteOne({ deviceId: deviceId });
    return;
  }

  async deleteAllDevicesByIdExceptThis(user: UserInfoRtType) {
    await this.deviceModel.deleteMany({
      userId: user.id,
      deviceId: { $ne: user.deviceId },
    });
    return;
  }

  async deleteAllUserDevices(userId: string) {
    await this.deviceModel.deleteMany({ userId: userId });
    return;
  }
}
