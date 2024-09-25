import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ExistRole } from 'src/core/role.guard';
import { GetPaginateInfo, ResponseMessage } from 'src/decorators/customize';
import { CheckValidId } from 'src/core/id.guard';
import { PaginateInfo } from 'src/interface/paginate.interface';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { CheckQueryForPagination } from 'src/core/query.guard';

@ApiTags('roles')
@Controller({ path: 'roles', version: '1' })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(ExistRole)
  @ResponseMessage("Create a role")
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  // lấy thông tin role có phân trang
  @Get()
  @ApiQuery({ name: 'page', required: false, description: "default: 1", type: Number })
  @ApiQuery({ name: 'limit', required: false, description: "default: 10", type: Number })
  @UseGuards(CheckQueryForPagination)
  @ResponseMessage("Get a list of roles")
  findAll(
    @GetPaginateInfo() info : PaginateInfo
  ) {
    return this.rolesService.findAll(info);
  }

  @Get(':id')
  @UseGuards(CheckValidId)
  @ResponseMessage("Get a role")
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(CheckValidId)
  @ResponseMessage("Update a role")
  update(
    @Param('id') id: string, 
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @UseGuards(CheckValidId)
  @ResponseMessage("Delete a role")
  remove(
    @Param('id') id: string,
  ) {
    return this.rolesService.remove(+id);
  }
}