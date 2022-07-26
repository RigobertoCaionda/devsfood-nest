import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { FIlterDto } from '../dtos/filter';
import { RoleDto } from '../dtos/role';
import { UpdateRoleDto } from '../dtos/update_role';
import { RolesService } from '../services/roles.service';

@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) {}
    @Get()
    index(@Query() query: FIlterDto) {
        const { skip = 0, take = 1 } = query;
        return this.rolesService.index({ 
            skip, 
            take
        });
    }

    @Get(':id')
    show(@Param('id', ParseIntPipe) id: number) { // No Params vc decide como quer recebe-los, se é como string ou como number
        return this.rolesService.show(id);
    }

    @Post()
    create(@Body() body: RoleDto) {
        return this.rolesService.create(body);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() body: UpdateRoleDto
        ) {
        return this.rolesService.update(body, id);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.delete(id);
    }
}
