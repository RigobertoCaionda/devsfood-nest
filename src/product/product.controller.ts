import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from 'src/auth/decorators/skip-auth';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FIlterDto } from 'src/user/roles/dtos/filter';
import { fileInterceptorOptionsHelper } from './helper/file_interceptor_options';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(Role.Admin)
  @UseInterceptors(
    FilesInterceptor('images', null, fileInterceptorOptionsHelper),
  )
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    createProductDto.images = files;
    return this.productService.create(createProductDto);
  }

  @Public()
  @Get()
  findAll(@Query() query: FIlterDto) {
    const { skip = 0, take = 5, category } = query;
    return this.productService.findAll({ skip, take, category });
  }

  @Public()
  @Get('/find/all/no-pagination')
  findAllWithNoPagination() {
    return this.productService.findAllWithNoPagination();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Public()
  @Get('/product_name/get')
  findProductByName(@Query() query) {
    const { name } = query;
    return this.productService.findProductByName(name);
  }

  @Roles(Role.Admin)
  @Post(':id')
  @UseInterceptors(
    FilesInterceptor('images', null, fileInterceptorOptionsHelper),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    updateProductDto.images = files;
    return this.productService.update(id, updateProductDto);
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

  @Delete('/delete-all/all')
  @Roles(Role.Admin)
  deleteProducts() {
    return this.productService.deleteAll();
  }
}
