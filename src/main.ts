import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConfig from './auth/env-helper/app.config';


async function bootstrap() {
  const port = appConfig().port || 3000; // Por causa do deploy na heroku, não temos porta 3000, então vamos usar a porta que a heroku nos fornecer.
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true  })); // O Whitelist elimina/ignora da requisição todos aqueles dados que não estão no dto
  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['POST', 'PUT', 'PATCH', 'DELETE', 'GET']
  });
  await app.listen(port);
}
bootstrap();
