import { UserRole } from '@/graphql/types/graphql';

export function roleValue(role: UserRole): number {
  switch (role) {
    case UserRole.SuperAdmin:
      return 4;
    case UserRole.Admin:
      return 3;
    case UserRole.Contributor:
      return 2;
    default:
      return 1;
  }
}

export function isRoleAuthorized(minimum_required_role: UserRole, user_role: UserRole): boolean {
  return roleValue(user_role) >= roleValue(minimum_required_role);
}
