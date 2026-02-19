export default function Roles() {
  const roles = [
    { name: "Broker", desc: "Create submissions, manage clients, upload documents." },
    { name: "Underwriting Manager", desc: "Review, endorse, and route to co-insurers." },
    { name: "Co-Insurer", desc: "Provide quotes and track participation." },
    { name: "Insurer", desc: "Approve, audit, and report across all risks." },
  ];
  return (
    <section id="roles" className="relative border-b">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-emerald-50/50 dark:to-emerald-900/10" />
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="text-2xl font-semibold md:text-3xl">Built for every role</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">Focused dashboards with the right data for each responsibility.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r, i) => {
            const colors = [
              "from-blue-500/10 to-blue-600/5 border-blue-200/50",
              "from-emerald-500/10 to-emerald-600/5 border-emerald-200/50",
              "from-indigo-500/10 to-indigo-600/5 border-indigo-200/50",
              "from-purple-500/10 to-purple-600/5 border-purple-200/50",
            ];
            const badgeColors = [
              "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
              "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
              "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
              "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
            ];
            return (
              <div key={r.name} className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br ${colors[i]} p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                <div className={`mb-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${badgeColors[i]}`}>{r.name}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

