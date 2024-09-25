import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsNotEmpty } from "class-validator";

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  isActive: boolean;
}