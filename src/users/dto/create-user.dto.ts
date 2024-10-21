import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Role } from 'utils/contants';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  address: string;

  @IsEnum(Role)
  role:string;
}

export class RefreshTokenDTO {
  @IsNotEmpty({ message: 'refreshToken k duoc de trong' })
  refreshToken: string;
  @IsNotEmpty({ message: 'accessToken k duoc de trong' })
  accessToken: string;
}
