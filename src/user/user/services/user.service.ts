import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma.service';
import { RolesService } from 'src/user/roles/services/roles.service';
import { UpdateUserDto } from '../dtos/update_user';
import { UserDto } from '../dtos/user';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private rolesService: RolesService,
    private jwtService: JwtService,
  ) {}

  async index({ skip, take }): Promise<any> {
    let total = await this.prisma.user.findMany();
    let data = await this.prisma.user.findMany({
      skip,
      take,
      orderBy: {
        id: 'asc',
      },
    });
    return { data, total: total.length };
  }

  async me(user_payload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: user_payload.id,
      },
      select: { id: true, email: true, name: true, roleId: true, role: true },
    });
    return { data: user };
  }

  async show(id: number): Promise<any> {
    let user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return { data: user };
  }

  async findByEmail(email: string): Promise<any> {
    let user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return { data: user };
  }

  async create(userDto: UserDto): Promise<any> {
    let role = await this.rolesService.show(userDto.roleId);
    if (!role.data) throw new NotFoundException('Cargo não encontrado');

    let user = await this.findByEmail(userDto.email);
    if (user.data) throw new BadRequestException('Email já existe');
    let data = await this.prisma.user.create({ data: userDto });
    return {
      token: this.jwtService.sign({
        id: data.id,
        name: data.name,
        role: role.data.name,
      }),
      data,
    };
  }

  async update(userDto: UpdateUserDto, id: number): Promise<any> {
    if (userDto.roleId) {
      let role = await this.rolesService.show(userDto.roleId);
      if (!role.data) throw new NotFoundException('Cargo não encontrado');
    }

    let user = await this.show(id);
    if (!user.data) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (userDto.email) {
      let user = await this.findByEmail(userDto.email);
      if (user.data) throw new BadRequestException('Email já existe');
    }
    return await this.prisma.user.update({
      data: userDto,
      where: {
        id,
      },
    });
  }

  async delete(id: number): Promise<any> {
    let user = await this.show(id);
    if (!user.data) throw new NotFoundException('Usuário não encontrado');
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
