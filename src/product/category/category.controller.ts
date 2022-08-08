import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/skip-auth';
import { Role } from 'src/auth/enum/role.enum';
import { fileInterceptorOptionsHelper } from '../helper/file_interceptor_options';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './services/category.service';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @Public()
  index() {
    return this.categoryService.findAll();
  }

  @Post()
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('file', fileInterceptorOptionsHelper))
  create(
    @Body() body: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Precisa enviar uma imagem');
    body.image = file.filename;
    return this.categoryService.create(body);
  }
}
