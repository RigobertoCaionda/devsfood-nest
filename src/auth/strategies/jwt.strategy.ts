import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import appConfig from '../env-helper/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig().JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { id: payload.id, name: payload.name, role: payload.role }; // O que for retornado aqui será enviado na requisição.
  }
}
