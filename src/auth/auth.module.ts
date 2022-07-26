import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/services/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { RolesService } from 'src/user/roles/services/roles.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtConfig } from './env-helper/jwt.config';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService, 
    PrismaService, 
    RolesService,
     JwtStrategy,
     { provide: 'APP_GUARD', useClass: JwtAuthGuard } // Guardando todas as rotas do sistema
    ],
  imports: [
    JwtModule.registerAsync(JwtConfig),
  ]
})
export class AuthModule {
  
}
