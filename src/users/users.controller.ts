import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { GetPaginateInfo, Public, ResponseMessage, User } from 'src/decorators/customize';
import { IUser } from '../interface/users.interface';
import { UniqueGmail } from 'src/core/gmail.guard';
import { PaginateInfo } from 'src/interface/paginate.interface';
import { ApiTags } from '@nestjs/swagger';
import { CheckValidId } from 'src/core/id.guard';
import { ApiQuery } from '@nestjs/swagger';
import { CheckQueryForPagination } from 'src/core/query.guard';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(UniqueGmail)
  @ResponseMessage("Create a new User")
  create(@Body() createUserDto: CreateUserDto) {
    // tag Body = request.body
    // @Body là một overloading decorator, nó giúp chúng ta lấy dữ liệu từ request body ở nhiều kiểu dữ liệu khác nhau 
    // như string, number, object, array, ...
    return this.usersService.create(createUserDto);
  }

  // lấy thông tin của người dùng có phân trang
  @Get()
  @ApiQuery({ name: 'page', required: false, description: "default: 1", type: Number })
  @ApiQuery({ name: 'limit', required: false, description: "default: 10", type: Number })
  @UseGuards(CheckQueryForPagination)
  @ResponseMessage("Get a List of Users")
  findAll(
    @GetPaginateInfo() info: PaginateInfo
  ) {
    return this.usersService.findAll(info);
  }

  // lấy thông tin của 1 người dùng
  @Public()
  @Get(':id')
  @UseGuards(CheckValidId)
  @ResponseMessage("Get a User")
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // chỉnh sửa thông tin người dùng
  @Patch(':id')
  @UseGuards(CheckValidId)
  @ResponseMessage("Update a User")
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // đưa một người dùng vào thùng rác
  @Delete(':id')
  @UseGuards(CheckValidId)
  @ResponseMessage("Delete a User")
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}