import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';// Import the service

@Injectable()
export class ExistRole implements CanActivate {
  constructor(private readonly rolesService: RolesService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const name = request.body.name

    // Check if the role is unique
    const role = await this.rolesService.findRoleByName(name);
    if (role) {
      throw new BadRequestException(`Role ${name} already exists`);
    }
    return true;
  }
}
