export default function Features() {
  const items = [
    {
      title: "End-to-end Workflow",
      desc: "Submissions, renewals, and amendments with audit trails.",
    },
    {
      title: "Role-based Access",
      desc: "Strict RBAC for Brokers, Managers, Insurers, and Co-Insurers.",
    },
    {
      title: "Real-time Collaboration",
      desc: "Comments, @mentions, and notifications to keep teams aligned.",
    },
    {
      title: "Documents & Attachments",
      desc: "Secure uploads, gallery view, and e-signature stubs.",
    },
    {
      title: "Analytics & Reporting",
      desc: "KPI cards, trends, and CSV/PDF export.",
    },
    {
      title: "Enterprise Security",
      desc: "MFA, JWT sessions, encrypted fields, and activity logs.",
    },
  ];
  return (
    <section id="features" className="relative border-b">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-sky-50/50 dark:to-sky-900/10" />
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="text-2xl font-semibold md:text-3xl">Features that matter</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">Purpose-built for commercial and corporate insurance risk workflows.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f, i) => {
            const colors = [
              "from-blue-500/10 to-blue-600/5 border-blue-200/50",
              "from-emerald-500/10 to-emerald-600/5 border-emerald-200/50",
              "from-purple-500/10 to-purple-600/5 border-purple-200/50",
            ];
            const colorClass = colors[i % 3];
            return (
              <div
                key={f.title}
                className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br ${colorClass} p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${i % 3 === 0 ? "from-primary to-sky-400" : i % 3 === 1 ? "from-emerald-500 to-teal-400" : "from-purple-500 to-pink-500"}`} />
                <div className="text-lg font-bold text-foreground">{f.title}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

