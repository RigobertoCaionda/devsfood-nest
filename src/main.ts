import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true  })); // O Whitelist elimina/ignora da requisicao todos aqueles dados que nao estao no dto
  await app.listen(3000);
}
bootstrap();
