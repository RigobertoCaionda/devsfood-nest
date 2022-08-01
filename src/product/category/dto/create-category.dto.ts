import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class CreateCategoryDto {
    @IsOptional()
    @IsInt()
    id?: number;
  
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    image: string;
  }
  