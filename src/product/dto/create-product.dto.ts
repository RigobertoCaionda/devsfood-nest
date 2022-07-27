import { IsArray, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsOptional()
    @IsInt()
    id?: number;

    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsNumber()
    price: number;
    
    @IsOptional()
    @IsArray({ message: 'url precisa ser um array' }) // Vai verificar se é um Array, os 2 devem ser combinados juntos
    @IsObject({ each: true }) // Vai verificar se cada item do array é uma string
    images?: Express.Multer.File[]; // O Tipo da imagem
}
