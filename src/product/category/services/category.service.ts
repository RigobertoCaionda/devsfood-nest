import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<{  data: any }> {
        const categories = await this.prisma.category.findMany();
        categories.map((category) => {
            category.image = `http://localhost:3000/product/uploads/${category.image}`;
        });
        return { data: categories };
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<any> {
        const category = await this.prisma.category.findMany({
            where: {
                name: createCategoryDto.name
            }
        });
        if(category && category.length > 0) {
            throw new BadRequestException('Categoria já existe');
        }
        return this.prisma.category.create({ data: createCategoryDto });
    }
}
