import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { FIlterDto } from '../dtos/filter';
import { RoleDto } from '../dtos/role';
import { UpdateRoleDto } from '../dtos/update_role';
import { RolesService } from '../services/roles.service';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}
  @Roles(Role.Admin)
  @Get()
  index(@Query() query: FIlterDto) {
    const { skip = 0, take = 1 } = query;
    return this.rolesService.index({
      skip,
      take,
    });
  }

  @Roles(Role.Admin)
  @Get(':id')
  show(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.show(id);
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() body: RoleDto) {
    return this.rolesService.create(body);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateRoleDto) {
    return this.rolesService.update(body, id);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.delete(id);
  }
}
