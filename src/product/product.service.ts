import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { unlink } from 'fs/promises';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto): Promise<any> {
    let newCreateProductDto = {
      name: createProductDto.name,
      price: createProductDto.price,
      status: true,
    };
    // O token continua funcionando mesmo quando o usuário é deletado
    const productExists = await this.prisma.product.findUnique({
      where: {
        name: createProductDto.name,
      },
    });
    if (productExists) throw new BadRequestException('Produto já existe');

    if (createProductDto.images && createProductDto.images.length > 0) {
      const imgData = [];
      createProductDto.images.forEach((img) => {
        imgData.push({ url: img.filename });
      });
      for (let product of imgData) {
        const imageExists = await this.prisma.image.findUnique({
          where: {
            url: product.url,
          },
        });
        if (imageExists) throw new BadRequestException('Imagem já existe');
      }
      const product = await this.prisma.product.create({
        data: {
          name: createProductDto.name,
          price: createProductDto.price,
          status: true,
          image: {
            create: imgData,
          },
        },
      });
      return { data: product };
    }
    const product = await this.prisma.product.create({
      data: newCreateProductDto,
    });
    return { data: product };
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    const images = await this.prisma.image.findMany({
      where: {
        productId: id,
      },
    });
    await this.prisma.image.deleteMany({
      // Primeiro apaga a imagem e depois o produto, caso contrário, vai dar erro de constraint
      where: {
        productId: id,
      },
    });
    await this.prisma.product.delete({
      where: {
        id,
      },
    });
    for (let i = 0; i < images.length; i++) {
      await unlink(`./public/${images[i].url}`);
    }
    return;
  }
}
