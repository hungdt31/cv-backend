import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { GetPaginateInfo, ResponseMessage, User } from 'src/decorators/customize';
import { ExistPermission } from 'src/core/permission.guard';
import { IUser } from 'src/interface/users.interface';
import { PaginateInfo } from 'src/interface/paginate.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('permissions')
@Controller({ path: 'permissions', version: '1' })
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @UseGuards(ExistPermission)
  @ResponseMessage('Create permission successfully')
  create(
    @Body() createPermissionDto: CreatePermissionDto
  ) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ResponseMessage("Fetch list of permissions with pagination")
  findByPagination(
    @GetPaginateInfo() info: PaginateInfo
  ) {
    return this.permissionsService.findAll(info);
  }

  @Get(':id')
  @ResponseMessage('Get permission successfully')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage('Update permission successfully')
  update(
    @Param('id') id: string, 
    @Body() updatePermissionDto: UpdatePermissionDto
  ) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @ResponseMessage('Remove permission successfully')
  remove(
    @Param('id') id: string
  ) {
    return this.permissionsService.remove(+id);
  }
}