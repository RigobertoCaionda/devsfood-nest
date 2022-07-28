import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from 'src/user/roles/services/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private rolesService: RolesService
    ) {}
  async signin(body): Promise<any> {
    if(!body.email || !body.password) throw new UnauthorizedException('Email ou senha errados');
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email
      }
    });
    
    if(!user) throw new UnauthorizedException('Email ou senha errados');
    const userExists = await bcrypt.compare(body.password, user.password);
    if(!userExists) throw new UnauthorizedException('Email ou senha errados');
    const role = await this.rolesService.show(user.roleId);

    return {
      token: this.jwtService.sign({
        id: user.id,
        name: user.name, 
        role: role.data.name
      }) // Como parametro do sign, passamos o payload, o payload é uma informação (Geralmente) sobre o usuário que adicionamos ao token. No payload aparece os dados que mandaste e tmbm o tempo que foi criado o token (iat) e o tempo que vai expirar (exp)
    };
  }
}
