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
      secretOrKey: appConfig().JWT_SECRET, // appConfig é uma função que retorna um objeto com a propriedade JWT_SECRET
    });
  }

  async validate(payload: any) { // Caso o user estiver autenticado, ele retorna o payload que nós criamos e podemos usar esse payload para retornar algum desses dados na request
    return { name: payload.name, role: payload.role }; // O que for retornado aqui será enviado na requisição.
  }
}