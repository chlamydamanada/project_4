import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DeviceEntity = HydratedDocument<Device>;

@Schema()
export class Device {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  lastActiveDate: number;

  @Prop({ required: true })
  expirationDate: number;

  createDevice(deviceDto) {
    this.deviceId = deviceDto.deviceId;
    this.ip = deviceDto.ip;
    this.title = deviceDto.title;
    this.userId = deviceDto.userId;
    this.lastActiveDate = deviceDto.lastActiveDate;
    this.expirationDate = deviceDto.expirationDate;
  }

  updateDevice(deviceDto) {
    this.deviceId = deviceDto.deviceId;
    this.ip = deviceDto.ip;
    this.title = deviceDto.title;
    this.lastActiveDate = deviceDto.lastActiveDate;
    this.expirationDate = deviceDto.expirationDate;
  }
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
DeviceSchema.methods = {
  createDevice: Device.prototype.createDevice,
  updateDevice: Device.prototype.updateDevice,
};
export const DeviceModel = { name: Device.name, schema: DeviceSchema };
