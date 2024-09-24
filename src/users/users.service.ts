import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { genSaltSync, hashSync, compareSync} from 'bcryptjs';
import { PrismaService } from 'prisma/prisma.service';
import { IUser } from '../interface/users.interface';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PaginateInfo } from 'src/interface/paginate.interface';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  getHashedPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);
    return hashedPassword;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedMyPassword = this.getHashedPassword(createUserDto.password);
    delete createUserDto.password;
    let res = await this.prismaService.user.create({
     data: {
        ... createUserDto,
        password: hashedMyPassword
     }
    });
    return {
      _id: res.id,
      createdAt: res.createAt,
    };
  }

  // async register(registerDto: RegisterDto) {
  //   const { password } = registerDto;
  //   registerDto.password = this.getHashedPassword(password);
  //   let user = await this.prismaService.usercreate({
  //     ...registerDto
  //   });
  //   delete user.password;
  //   return user;
  // }
  
  async findAll(info: PaginateInfo) {
    const { offset, defaultLimit, sort, projection, population, filter, currentPage } = info;
  
    // Get total items count
    const totalItems = await this.prismaService.user.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);
  
    // Retrieve data with Prisma
    const data = await this.prismaService.user.findMany({
      where: filter,
      skip: offset,
      take: defaultLimit,
      // orderBy: sort,
      // select: projection,
      // include: population,
    });
  
    return {
      meta: {
        totalUsers: totalItems,
        userCount: data.length,
        usersPerPage: defaultLimit,
        totalPages,
        currentPage,
      },
      result: data,
    };
  }
  
  async findOne(id: number) {
    const res = await this.prismaService.user.findFirst({
      where: {
        id
      },
      // not return password
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        age: true,
      }
    })
    if (!res) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return res;
  }

  async findOneByEmail(email: string) {
    return await this.prismaService.user.findFirst({
      where: {
        email
      }
    });
  }

  isValidPasword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: {
        id
      },
      data: {
        ...updateUserDto,
        // updateAt: new Date()
      }
    })
  }

  async remove(id: number) {
    return await this.prismaService.user.delete({
      where: {
        id
      }
    });
  }

  async updateUserToken (id: number, refreshToken: string) {
    return await this.prismaService.user.update({
      where: {
        id
      },
      data: {
        refreshToken
      }
    });
  }

  async findOneByRefreshToken(refreshToken: string) {
    return await this.prismaService.user.findFirst({
      where: {
        refreshToken
      }
    });
  }
}