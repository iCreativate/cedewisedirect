import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-72 w-72 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute left-[5%] top-[30%] h-64 w-64 rounded-full bg-emerald-400/25 blur-3xl" />
        <div className="absolute right-[5%] top-[50%] h-64 w-64 rounded-full bg-sky-400/25 blur-3xl" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0v24" fill="none" stroke="currentColor"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
      </div>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-r from-primary via-sky-400 to-emerald-500 bg-clip-text text-transparent">Insurance Risk Management</span> for modern brokers and carriers
          </h1>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Cedewise Direct streamlines submissions, underwriting, endorsements, and approvals across Brokers, Underwriting Managers, Insurers, and Co-Insurers.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/submissions/new" className="btn-primary px-8 py-3 text-base">Start a submission</Link>
            <Link href="/auth/login" className="btn-secondary px-8 py-3 text-base">Sign in</Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="badge badge-success border border-emerald-200 dark:border-emerald-800">WCAG AA</span>
            <span className="badge badge-info border border-blue-200 dark:border-blue-800">MFA</span>
            <span className="badge badge-warning border border-amber-200 dark:border-amber-800">Audit logs</span>
            <span className="badge badge-danger border border-red-200 dark:border-red-800">RBAC</span>
          </div>
          <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
            <span>Trusted by teams</span>
            <div className="flex items-center gap-2">
              <LogoPill>ACME</LogoPill>
              <LogoPill>Northstar</LogoPill>
              <LogoPill>Vertex</LogoPill>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-xl border bg-card/80 p-4 shadow-sm backdrop-blur">
            <div className="grid grid-cols-3 gap-4">
              <Metric label="Pending" value="12" color="from-amber-400 to-pink-500"/>
              <Metric label="Approval Rate" value="92%" color="from-emerald-400 to-teal-500"/>
              <Metric label="Avg. TAT" value="2.1d" color="from-sky-400 to-indigo-500"/>
            </div>
            <div className="mt-4 rounded-xl border bg-gradient-to-br from-background to-background/60 p-6 text-center text-sm text-muted-foreground ring-1 ring-white/10 dark:from-white/5 dark:to-white/[0.02]">KPI charts placeholder</div>
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-[1rem] bg-gradient-to-tr from-primary/15 via-transparent to-emerald-500/15 blur-2xl" />
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border bg-background p-3 text-center transition-shadow hover:shadow-md">
      <div className={`mx-auto mb-2 h-1 w-10 rounded-full bg-gradient-to-r ${color}`} />
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function LogoPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-border">
      {children}
    </span>
  );
}

