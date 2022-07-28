import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { RolesController } from './roles/controllers/roles.controller';
import { RolesService } from './roles/services/roles.service';
import { UserController } from './user/controllers/user.controller';
import { UserService } from './user/services/user.service';

@Module({
  controllers: [UserController, RolesController],
  providers: [UserService, RolesService, PrismaService],
})
export class UserModule {}
