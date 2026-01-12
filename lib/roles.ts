import { fetchGraphql } from "@/lib/graphql-client-ssr";
import {
  MeDocument,
  MeQuery,
  MeQueryVariables,
  StoreUserRole,
  User,
  UserRole,
} from "graphql-utils";

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

export function isRoleAuthorized(
  minimum_required_role: UserRole,
  user_role: UserRole
): boolean {
  return roleValue(user_role) >= roleValue(minimum_required_role);
}

export function storeUserRoleValue(role: StoreUserRole): number {
  switch (role) {
    case (StoreUserRole.Owner, StoreUserRole.Admin):
      return roleValue(UserRole.SuperAdmin);
    case (StoreUserRole.Manager, StoreUserRole.Supervisor):
      return roleValue(UserRole.Admin);
    default:
      return roleValue(UserRole.Contributor);
  }
}

export function isStoreUserAuthorized(
  minimum_required_role: StoreUserRole,
  store_user_role: StoreUserRole
): boolean {
  return (
    storeUserRoleValue(store_user_role) >=
    storeUserRoleValue(minimum_required_role)
  );
}

export async function adminAuthorize(
  auth_token?: string | null
): Promise<User | undefined> {
  if (!auth_token) return undefined;

  const { data, errors } = await fetchGraphql<MeQueryVariables, MeQuery>(
    MeDocument,
    "query",
    undefined,
    auth_token
  );
  if (errors || !data) return undefined;

  if (!isRoleAuthorized(UserRole.Admin, data.me.role)) {
    return undefined;
  }
  return data.me as User;
}
