import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { unlink, rmdir, readdir } from 'fs/promises';
import appConfig from 'src/auth/env-helper/app.config';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto): Promise<any> {
    if(Number(createProductDto.categoryId).toString() == 'NaN') {
        throw new BadRequestException('Categoria inválida');
      }
      
    if(Number(createProductDto.price).toString() == 'NaN') {
        throw new BadRequestException('Preço inválido');
      }
    let newCreateProductDto = {
      name: createProductDto.name,
      price: createProductDto.price,
      categoryId: createProductDto.categoryId,
      status: true,
    };
    const productExists = await this.prisma.product.findUnique({
      where: {
        name: createProductDto.name,
      },
    });
    if (productExists) throw new BadRequestException('Produto já existe');
    const category = await this.prisma.category.findUnique({
      where: {
        id: Number(createProductDto.categoryId),
      },
    });
    if (!category) throw new NotFoundException('Categoria não encontrada');

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
          price: Number(createProductDto.price),
          categoryId: Number(createProductDto.categoryId),
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

  async findAllWithNoPagination(): Promise<any> {
    const data = await this.prisma.product.findMany();
    return { data };
  }
  async findAll({ take, skip, category }): Promise<any> {
    const total = await this.prisma.product.findMany();
    const totalPages = total.length / take;
    if (category && category !== 0) {
      const categoryProducts = await this.prisma.category.findUnique({
        where: {
          id: parseInt(category),
        },
        include: {
          product: true,
          _count: true,
        }
      });
      const totalCategoryProducts = Math.ceil(
        categoryProducts._count.product / take,
      );
      const categoryProductsList = await this.prisma.category.findMany({
        where: {
          id: parseInt(category),
        },
        include: {
          product: {
            skip: parseInt(skip), // Fazendo a paginação dos produtos que a categria está trazendo na relação
            take: parseInt(take),
            include: {
              image: true,
            },
          },
          _count: true,
        },
      });
      categoryProductsList[0].product.map((product) => {
        if (product.image && product.image.length > 0) {
          product.image[0].url = `${appConfig().baseURL}/product/uploads/${
            product.image[0].url
          }`;
        }
      });
      return {
        data: categoryProductsList[0].product,
        total: totalCategoryProducts,
      };
    }
    const data = await this.prisma.product.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      orderBy: {
        name: 'asc',
      },
      include: {
        image: true,
        category: true,
      },
    });
    data.map((product) => {
      if (product.image && product.image.length > 0) {
        product.image[0].url = `${appConfig().baseURL}/product/uploads/${
          product.image[0].url
        }`;
      }
    });
    return { data, total: Math.ceil(totalPages) };
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
    if (updateProductDto.price) newUpdateProductDto.price = Number(updateProductDto.price);
    if (updateProductDto.categoryId) newUpdateProductDto.categoryId = Number(updateProductDto.categoryId);
    if (updateProductDto.status) newUpdateProductDto.status = updateProductDto.status;

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
      include: {
        image: true
      }
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

  async deleteAll() {
    const images = await this.prisma.image.findMany();
    await this.prisma.image.deleteMany();
    await this.prisma.product.deleteMany();
    for(let i in images) {
      await unlink(`./public/${images[i].url}`);
    }
    //let files = await readdir('./public'); // Retorna um array com o nome de todos os arquivos que estão dentro de uma pasta
    //await rmdir(`./public`, { recursive: true }); // Apaga uma pasta inteira
  }
}
