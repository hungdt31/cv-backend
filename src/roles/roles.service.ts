import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'prisma/prisma.service';
import { PaginateInfo } from 'src/interface/paginate.interface';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class RolesService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    return await this.prismaService.role.create({
      data: {
        ...createRoleDto
      }
    });
  }

  async findRoleById (id: number) {
    const res = await this.prismaService.role.findFirst({
      where: {
        id
      },
      include: {
        permission: true
      }
    })
    return res;
  }

  async findRoleByName(name: string) {
    return await this.prismaService.role.findFirst({
      where: {
        name
      }
    });
  }

  async findAll(info : PaginateInfo) {
    const { offset, defaultLimit, sort, projection, population, filter, currentPage } = info;
  
    // Get total items count
    const totalItems = await this.prismaService.permission.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);
  
    // Retrieve data with Prisma
    const data = await this.prismaService.permission.findMany({
      where: filter,
      skip: offset,
      take: defaultLimit,
      // orderBy: sort,
      // select: projection,
      // include: population,
    });
  
    return {
      meta: {
        totalRoles: totalItems,
        roleCount: data.length,
        rolesPerPage: defaultLimit,
        totalPages,
        currentPage,
      },
      result: data,
    };
  }

  async findOne(id: number) {
    const res = await this.findRoleById(id);
    if (!res) {
      throw new HttpException("Role not found", HttpStatus.NOT_FOUND);
    }
    return res;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const res = await this.findRoleById(id);
    if (!res) {
      throw new HttpException("Role not found", HttpStatus.NOT_FOUND);
    }
    return this.prismaService.role.update({
      where: {
        id
      },
      data: {
        ... updateRoleDto
      }
    })
  }

  async remove(id: number) {
    const res = await this.findRoleById(id);
    if (!res) {
      throw new HttpException("Role not found", HttpStatus.NOT_FOUND);
    }
    return await this.prismaService.role.delete({
      where: {
        id
      }
    })
  }
}