export type UserRole = "BROKER" | "UNDERWRITING_MANAGER" | "CO_INSURER" | "INSURER";

export const roleDashboardPath: Record<UserRole, string> = {
  BROKER: "/dashboard/broker",
  UNDERWRITING_MANAGER: "/dashboard/underwriting-manager",
  CO_INSURER: "/dashboard/co-insurer",
  INSURER: "/dashboard/insurer",
};

export function isDashboardPathAllowed(role: UserRole, pathname: string) {
  const base = roleDashboardPath[role];
  // Role-scoped dashboard pages live under the role base path (e.g. /dashboard/broker/*)
  if (pathname.startsWith(base)) return true;

  // Shared dashboard pages that are valid for all authenticated roles.
  // These are implemented outside the role base for re-use.
  if (pathname.startsWith("/dashboard/submissions")) return true;

  return false;
}

