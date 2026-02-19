import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative border-b">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-fuchsia-50/50 dark:to-fuchsia-900/10" />
      <div className="mx-auto max-w-7xl px-4 py-20 text-center md:px-6">
        <h2 className="text-3xl font-bold md:text-4xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Ready to streamline your risk workflow?</h2>
        <p className="mt-4 text-lg text-muted-foreground">Start a submission or explore role dashboards.</p>
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-border/40 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 p-8 shadow-xl backdrop-blur-sm">
          <Link href="/submissions/new" className="btn-primary px-8 py-3 text-base">Start a submission</Link>
          <Link href="/auth/login" className="btn-secondary px-8 py-3 text-base">View dashboards</Link>
        </div>
      </div>
    </section>
  );
}

