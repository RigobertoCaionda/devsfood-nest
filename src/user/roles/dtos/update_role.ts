import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class UpdateRoleDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;
}
