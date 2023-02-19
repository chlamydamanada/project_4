import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authConstants } from '../authConstants';
import { AccessTokenStrategyType } from '../types/accessTokenStrategyType';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConstants.jwt_secretAT!,
    });
  }

  async validate(payload: AccessTokenStrategyType): Promise<{ id: string }> {
    //console.log('AccessTokenStrategy:', payload);
    if (!payload) throw new UnauthorizedException();
    return { id: payload.userId };
  }
}
