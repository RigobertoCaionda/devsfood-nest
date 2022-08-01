import { IsString, IsOptional } from 'class-validator';
export class FIlterDto {
  @IsOptional()
  @IsString()
  skip?: string;

  @IsOptional()
  @IsString()
  take?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
