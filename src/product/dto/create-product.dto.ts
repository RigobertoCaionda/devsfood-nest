import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  price: number;

  @IsString()
  categoryId: number;

  @IsOptional()
  @IsArray({ message: 'url precisa ser um array' }) // Vai verificar se é um Array, os 2 devem ser combinados
  @IsObject({ each: true }) // Vai verificar se cada item do array é uma string
  images?: Express.Multer.File[];
}
