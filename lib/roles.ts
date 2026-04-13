import { fetchGraphql } from "@/lib/graphql-client-ssr";
import {
  MeDocument,
  MeQuery,
  MeQueryVariables,
  StoreUser,
  StoreUserAuthorizedDocument,
  StoreUserAuthorizedQuery,
  StoreUserAuthorizedQueryVariables,
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

export async function authorize(
  authToken?: string | null
): Promise<User | undefined> {
  if (!authToken) return undefined;

  const { data, errors } = await fetchGraphql<MeQueryVariables, MeQuery>(
    MeDocument,
    "query",
    undefined,
    authToken
  );
  if (errors || !data) return undefined;

  return data.me as User;
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
  minimumRequiredRole: StoreUserRole,
  storeUserRole: StoreUserRole
): boolean {
  return (
    storeUserRoleValue(storeUserRole) >=
    storeUserRoleValue(minimumRequiredRole)
  );
}

// Admin user authorization check
export async function adminAuthorize(
  authToken?: string | null
): Promise<User | undefined> {
  const user = await authorize(authToken);
  if (!user) return undefined;

  if (!isRoleAuthorized(UserRole.Admin, user.role)) {
    return undefined;
  }
  return user;
}

export async function storeUserAuthorized(
  authToken: string,
  storeId: number,
  branchId?: number,
): Promise<StoreUser | undefined> {
  if (!authToken) return undefined;

  const { data, errors } = await fetchGraphql<StoreUserAuthorizedQueryVariables, StoreUserAuthorizedQuery>(
    StoreUserAuthorizedDocument,
    "query",
    { storeId, branchId },
    authToken
  );
  if (errors || !data) return undefined;

  return data.storeUserAuthorized as StoreUser;
}
