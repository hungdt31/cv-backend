import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { GetPaginateInfo, ResponseMessage } from 'src/decorators/customize';
import { ExistPermission } from 'src/core/permission.guard';
import { CheckValidId } from 'src/core/id.guard';
import { PaginateInfo } from 'src/interface/paginate.interface';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { CheckQueryForPagination } from 'src/core/query.guard';

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


  // lấy thông tin permission có phân trang
  @Get()
  @ApiQuery({ name: 'page', required: false, description: "default: 1", type: Number })
  @ApiQuery({ name: 'limit', required: false, description: "default: 10", type: Number })
  @UseGuards(CheckQueryForPagination)
  @ResponseMessage("Fetch list of permissions with pagination")
  findByPagination(
    @GetPaginateInfo() info: PaginateInfo
  ) {
    return this.permissionsService.findAll(info);
  }

  @Get(':id')
  @UseGuards(CheckValidId)
  @ResponseMessage('Get permission successfully')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(CheckValidId)
  @ResponseMessage('Update permission successfully')
  update(
    @Param('id') id: string, 
    @Body() updatePermissionDto: UpdatePermissionDto
  ) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @UseGuards(CheckValidId)
  @ResponseMessage('Remove permission successfully')
  remove(
    @Param('id') id: string
  ) {
    return this.permissionsService.remove(+id);
  }
}