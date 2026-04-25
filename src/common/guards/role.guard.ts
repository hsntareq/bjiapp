import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard that checks if the user's organization type matches the @Roles() decorator
 *
 * Usage:
 * @UseGuards(JwtAuthGuard, RoleGuard)
 * @Roles('CENTRAL', 'CITY')
 * @Post()
 * create() { ... }
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are specified, allow access (backward compatibility)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.organizationId) {
      throw new ForbiddenException('User organization not found');
    }

    // Load user's organization to get its type
    const userOrg = await this.orgRepository.findOne({
      where: { id: user.organizationId },
    });

    if (!userOrg) {
      throw new ForbiddenException('User organization does not exist');
    }

    // Check if user's org type is in the allowed roles
    if (!requiredRoles.includes(userOrg.type)) {
      throw new ForbiddenException(
        `Only users from ${requiredRoles.join(', ')} organizations can access this resource. You are from a ${userOrg.type} organization.`,
      );
    }

    // Attach organization to request for use in services
    request.userOrg = userOrg;

    return true;
  }
}
