import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { roleDashboardPath } from "@/lib/rbac";

export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");
  const role = (session.user as any).role as keyof typeof roleDashboardPath;
  redirect(roleDashboardPath[role]);
}

