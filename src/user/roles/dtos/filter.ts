import { IsInt, IsOptional } from 'class-validator';
export class FIlterDto {
  @IsOptional()
  @IsInt()
  skip?: number;

  @IsOptional()
  @IsInt()
  take: string;
}
