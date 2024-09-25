import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'prisma/prisma.service';
import { IUser } from 'src/interface/users.interface';
import { PaginateInfo } from 'src/interface/paginate.interface';

@Injectable()
export class PermissionsService {
  constructor(
    private prismaService: PrismaService
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    return await this.prismaService.permission.create({
      data: {
        ... createPermissionDto
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
        totalPermissions: totalItems,
        permissionCount: data.length,
        permissionsPerPage: defaultLimit,
        totalPages,
        currentPage,
      },
      result: data,
    };
  }

  async findPermissionById(id: number) {
    const res = await this.prismaService.permission.findFirst({
      where: {
        id
      },
    })
    return res;
  }

  async findOne(id: number) {
    const res = await this.findPermissionById(id);
    if (!res) {
      throw new HttpException("Permission not found", HttpStatus.NOT_FOUND);
    }
    return res;
  }

  async checkNewValidPermission(method: string, apiPath: string) : Promise<boolean> {
    // Check if the method and apiPath is unique
    const permission = await this.prismaService.permission.findFirst({
      where: {
        method,
        apiPath
      }
    });
    return permission ? false : true;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const res = await this.findPermissionById(id);
    if (!res) {
      throw new HttpException("Permission not found", HttpStatus.NOT_FOUND);
    }
    return await this.prismaService.permission.update({
      where: {
        id
      },
      data: {
        ...updatePermissionDto
      }
    })
  }

  async remove(id: number) {
    const res = await this.findPermissionById(id);
    if (!res) {
      throw new HttpException("Permission not found", HttpStatus.NOT_FOUND);
    }
    return await this.prismaService.permission.delete({
      where: {
        id
      }
    })
  }
}