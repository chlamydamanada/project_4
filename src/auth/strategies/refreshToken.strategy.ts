import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authConstants } from '../authConstants';
import { RefreshTokenStrategyType } from '../types/refreshTokenStrategyType';
import { Request } from 'express';
import { DevicesRepository } from '../../repositories/device.repository';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly devicesRepository: DevicesRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request.cookies.refreshToken;
          if (!data) return null;
          return data;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: authConstants.jwt_secretRT,
    });
  }

  async validate(
    payload: RefreshTokenStrategyType,
  ): Promise<{ id: string; deviceId: string }> {
    const device = await this.devicesRepository.findDeviceByDeviceId(
      payload.deviceId,
    );
    if (!device) throw new UnauthorizedException('refresh token not found');
    if (payload.iat !== device.lastActiveDate)
      throw new UnauthorizedException('refresh token is already invalid');

    //console.log('RefreshTokenStrategy:', payload);
    return { id: payload.userId, deviceId: payload.deviceId };
  }
}
