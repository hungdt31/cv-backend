import { IsEnum, IsNotEmpty, IsNumber } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

enum Module {
  USER = "USERS",
  PERMISSION = "PERMISSIONS",
  ROLE = "ROLES",
  COMPANY = "COMPANIES",
  RESUME = "RESUMES",
}

export class CreatePermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  apiPath: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Method)
  method: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Module)
  module: string 

  @IsNumber()
  roleId: number
}