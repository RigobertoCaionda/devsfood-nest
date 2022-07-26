import { IsEmail, IsInt, IsOptional, Matches, MinLength } from 'class-validator';
export class UpdateUserDto {
    @IsOptional()
    @IsInt()
    id?: number;

    @IsOptional()
    @MinLength(2)
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @MinLength(8)
    @IsOptional()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Senha fraca'
    })
    password?: string;

    @IsInt()
    @IsOptional()
    roleId?: number;
}