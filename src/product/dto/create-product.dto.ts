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
  price: number; // Recebendo como string pq o valor virá de um formData e um formData só envia string ou blob

  @IsString()
  categoryId: number;

  @IsOptional()
  @IsArray({ message: 'url precisa ser um array' }) // Vai verificar se é um Array, os 2 devem ser combinados juntos
  @IsObject({ each: true }) // Vai verificar se cada item do array é uma string
  images?: Express.Multer.File[]; // O Tipo da imagem
}
