import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true  })); // O Whitelist elimina/ignora da requisição todos aqueles dados que não estão no dto
  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['POST', 'PUT', 'PATCH', 'DELETE', 'GET']
  });
  await app.listen(3000);
}
bootstrap();
