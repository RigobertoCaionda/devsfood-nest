import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleDto } from '../dtos/role';
//import { Role } from '@prisma/client'; Ver isso
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) {}
    async index({ skip, take }): Promise<any> {
        let total =  await this.prisma.role.findMany();
        let data = await this.prisma.role.findMany({
            skip,
            take,
            orderBy: {
                id: 'asc'
            } 
        });
        return { data, total: total.length };
    }

    async show(id: number): Promise<any> {
         let role = await this.prisma.role.findUnique({
            where: {
                id
            }
        });
        return { data: role };
    }
    
    async create(role: RoleDto): Promise<any> {
         return await this.prisma.role.create({ data: role });
    }

    async update(data: RoleDto, id: number): Promise<any> {
        let role = await this.show(id);
        if(!role.data) {
            throw new NotFoundException('Cargo não encontrado');
        }
        return await this.prisma.role.update({
            data,
            where: {
                id
            }
        });
    }

    async delete(id: number): Promise<any> {
        let role = await this.show(id);
        if(!role.data) {
            throw new NotFoundException('Cargo não encontrado');
        } 
        await this.prisma.role.delete({
            where: {
                id
            }
        });
    }
}
