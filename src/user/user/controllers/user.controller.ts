import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { UserDto } from '../dtos/user';
import { UserService } from '../services/user.service';
import * as bcrypt from 'bcrypt';
import { FIlterDto } from 'src/user/roles/dtos/filter';
import { UpdateUserDto } from '../dtos/update_user';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    index(@Query() query: FIlterDto) {
        const { skip = 0, take = 1 } = query;
        return this.userService.index({ 
            skip,
            take
         });
    }

    @Get(':id')
    show(@Param('id', ParseIntPipe) id: number) {
        return this.userService.show(id);
    }

    @Post()
    async create(@Body() body: UserDto) {
        const salt = 10;
        const passwordHash = await bcrypt.hash(body.password, salt);
        body.password = passwordHash;
        return this.userService.create(body);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() body: UpdateUserDto
    ) {
       if(body.password) {
        const salt = 10;
        const passwordHash = await bcrypt.hash(body.password, salt);
        body.password = passwordHash;
       }
        return this.userService.update(body, id);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }
}
