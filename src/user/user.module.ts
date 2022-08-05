import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/auth/env-helper/jwt.config';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { PrismaService } from 'src/services/prisma.service';
import { RolesController } from './roles/controllers/roles.controller';
import { RolesService } from './roles/services/roles.service';
import { UserController } from './user/controllers/user.controller';
import { UserService } from './user/services/user.service';

@Module({
  controllers: [UserController, RolesController],
  providers: [UserService, RolesService, PrismaService, JwtStrategy],
  imports: [JwtModule.registerAsync(JwtConfig)],
})
export class UserModule {}
