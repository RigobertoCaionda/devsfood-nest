import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Res,
  ParseIntPipe
} from '@nestjs/common';
import { Response } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from 'src/auth/decorators/skip-auth';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(Role.Admin)
  @UseInterceptors(
    FilesInterceptor('images', null, {
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()} - ${file.originalname}`);
        },
      }),
      fileFilter(req, file, cb) {
        if (['image/png', 'image/jpeg'].includes(file.mimetype)) {
          cb(null, true);
        } else {
          return cb(
            new BadRequestException(
              'Arquivos desta extensão não são permitidos',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 2000000,
      },
    }),
  )
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    // Problema: Ele cria as fotos mesmo quando dá problema nos registros, mas ele não cria os registros se der problema nas fotos pq o interceptor é chamado primeiro em relação ao validationPipe
    createProductDto.images = files;
    return this.productService.create(createProductDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }

  @Public()
  @Get('/uploads/:img')
  getImagePath(@Param('img') image: string, @Res() res: Response) {
    res.sendFile(image, { root: 'public' });
  }
}
