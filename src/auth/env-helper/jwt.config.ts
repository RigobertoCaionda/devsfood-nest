import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import appConfig from './app.config';

export const JwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => {
    // useFactory pq vamos retornar dados assíncoronos, vamos de forma assíncrona retornar o secret e o signOptions
    return {
      secret: appConfig().JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    };
  },
};
