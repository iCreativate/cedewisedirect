"use client";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data } = useSession();
  const name = data?.user?.name ?? "User";
  const role = (data?.user as any)?.role ?? "";
  return (
    <header className="flex items-center justify-between border-b p-4">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-xs text-muted-foreground">Signed in as {name} · {role}</p>
      </div>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="rounded-full bg-muted px-3 py-1">Notifications</span>
        <span className="rounded-full bg-muted px-3 py-1">Profile</span>
      </div>
    </header>
  );
}

