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

  async findAll({ take, skip }): Promise<any> {
    const total = await this.prisma.product.findMany();
    const data = await this.prisma.product.findMany({
      skip,
      take,
      orderBy: {
        name: 'asc',
      },
      include: {
        image: true,
      },
    });
    return { data, total: total.length };
  }

  async findOne(id: number): Promise<{ data: CreateProductDto }> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        image: true,
      },
    });
    return { data: product };
  }

  async findProductByName(name: string): Promise<{ data: CreateProductDto[] }> {
    if (!name) {
      return { data: [] };
    }
    const product = await this.prisma.product.findMany({
      where: {
        name: {
          contains: name,
        },
        AND: {
          status: true,
        },
      },
      include: {
        image: true,
      },
    });
    return { data: product };
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<any> {
    const newUpdateProductDto: any = {};
    if (updateProductDto.id) newUpdateProductDto.id = updateProductDto.id;
    if (updateProductDto.name) newUpdateProductDto.name = updateProductDto.name;
    if (updateProductDto.price)
      newUpdateProductDto.price = updateProductDto.price;
    if (updateProductDto.status)
      newUpdateProductDto.status = updateProductDto.status;

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
      where: {
        productId: id,
      },
    });

    for (let i = 0; i < images.length; i++) {
      await unlink(`./public/${images[i].url}`);
    }

    if (updateProductDto.images && updateProductDto.images.length > 0) {
      const imgData = [];
      updateProductDto.images.forEach((img) => {
        imgData.push({ url: img.filename, productId: product.id });
      });
      for (let product of imgData) {
        const imageExists = await this.prisma.image.findUnique({
          where: {
            url: product.url,
          },
        });
        if (imageExists) throw new BadRequestException('Imagem já existe');
        await this.prisma.image.createMany({ data: imgData });
      }
    }
    const new_product = await this.prisma.product.update({
      data: newUpdateProductDto,
      where: {
        id,
      },
    });
    return { data: new_product };
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
