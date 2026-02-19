"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { roleDashboardPath } from "@/lib/rbac";
import {
  BarChart3,
  Grid3X3,
  FileText,
  FileSpreadsheet,
  Users,
  ClipboardList,
  Calendar as CalendarIcon,
  FilePlus2,
  BadgeDollarSign,
  Coins,
  GraduationCap,
  UserCircle,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import LogoIcon from "@/components/LogoIcon";

export default function DashboardShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const pathname = usePathname();
  const { data } = useSession();
  const role = (data?.user as any)?.role as
    | "BROKER"
    | "UNDERWRITING_MANAGER"
    | "CO_INSURER"
    | "INSURER"
    | undefined;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login", redirect: true });
  };

  let nav = [
    { href: "/dashboard/broker", label: "Broker" },
    { href: "/dashboard/underwriting-manager", label: "Manager" },
    { href: "/dashboard/co-insurer", label: "Co-Insurer" },
    { href: "/dashboard/insurer", label: "Insurer" },
  ];

  // RBAC: Each role sees only their own dashboard link
  if (role) {
    nav = nav.filter((n) =>
      (role === "BROKER" && n.href.includes("/dashboard/broker")) ||
      (role === "UNDERWRITING_MANAGER" && n.href.includes("/dashboard/underwriting-manager")) ||
      (role === "CO_INSURER" && n.href.includes("/dashboard/co-insurer")) ||
      (role === "INSURER" && n.href.includes("/dashboard/insurer"))
    );
  }
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[260px] border-r border-border/40 bg-card/95 backdrop-blur-sm p-6 overflow-y-auto md:block shadow-lg">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-primary to-primary/80 p-2 shadow-md">
            <LogoIcon className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <span className="text-base font-bold text-foreground">Cedewise</span>
            <span className="text-base font-semibold text-primary"> Direct</span>
          </div>
        </div>
        <nav className="space-y-1">
          {nav.map((n) => {
            const isActive = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm border border-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <div className={`h-1.5 w-1.5 rounded-full transition-all ${isActive ? "bg-primary" : "bg-transparent group-hover:bg-muted-foreground"}`} />
                <span>{n.label}</span>
              </Link>
            );
          })}
          {/* Secondary nav shared across roles */}
          <div className="mt-8 mb-3 px-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workspace</div>
          </div>
          {(() => {
            const base = role ? roleDashboardPath[role] : "/dashboard";
            const items: { label: string; path: string; Icon: any }[] = [
              { label: "Analytics", path: "analytics", Icon: BarChart3 },
              { label: "Heat Map", path: "heatmap", Icon: Grid3X3 },
              { label: "Documents", path: "documents", Icon: FileText },
              { label: "Survey Reports", path: "reports", Icon: FileSpreadsheet },
              { label: "Clients", path: "clients", Icon: Users },
              { label: "Audits", path: "audits", Icon: ClipboardList },
              { label: "Calendar", path: "calendar", Icon: CalendarIcon },
              { label: "Submissions", path: "submissions", Icon: FilePlus2 },
              { label: "My Quote", path: "quotes", Icon: BadgeDollarSign },
              { label: "Currency Convertor", path: "currency", Icon: Coins },
              { label: "Learning Portal", path: "learning", Icon: GraduationCap },
              { label: "Profile", path: "profile", Icon: UserCircle },
              { label: "Settings", path: "settings", Icon: SettingsIcon },
            ];
            return items.map((item) => {
              const href = `${base}/${item.path}`;
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm border border-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <item.Icon className={`h-4 w-4 transition-colors ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            });
          })()}
        </nav>
      </aside>
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:ml-[260px] min-h-screen w-full">
        {/* Fixed Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md px-6 py-4 shadow-sm">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-sm">
              <button className="text-muted-foreground hover:text-foreground transition-colors font-medium hover:underline">
                Notifications
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors font-medium hover:underline">
                Profile
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-accent hover:border-primary/20 hover:shadow-sm"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/10 p-6">{children}</main>
      </div>
    </div>
  );
}

