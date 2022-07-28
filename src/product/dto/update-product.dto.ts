import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsBoolean, IsInt, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    
    @IsInt()
    @IsOptional()
    id?: number;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsBoolean()
    status?: boolean;

    @IsOptional()
    @IsArray({ message: 'images precisa ser um array' }) 
    @IsObject({ each: true })
    images?: Express.Multer.File[];
}
