import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to inject the current user's organization context from JWT
 *
 * Example:
 * @Post()
 * create(@OrgContext() org: any) {
 *   console.log(org.organizationId);
 * }
 */
export const OrgContext = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return {
    organizationId: request.user?.organizationId,
    userId: request.user?.userId,
    roleId: request.user?.roleId,
    canCreateUsers: request.user?.canCreateUsers,
  };
});
