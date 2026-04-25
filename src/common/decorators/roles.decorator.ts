import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify which organization types can access an endpoint
 * @param types - Organization types (CENTRAL, CITY, THANA, WARD, UNIT)
 *
 * Example:
 * @Roles('CENTRAL', 'CITY')
 * @Post()
 * create() { ... }
 */
export const Roles = (...types: string[]) => SetMetadata(ROLES_KEY, types);
