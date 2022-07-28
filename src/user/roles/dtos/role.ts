import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class RoleDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
