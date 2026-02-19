export default function Workflow() {
  const steps = [
    { title: "Submit", desc: "Broker creates new risk with details and attachments." },
    { title: "Underwrite", desc: "Manager reviews, adds notes, and routes as needed." },
    { title: "Co-Insure", desc: "Co-insurers propose quotes and participation." },
    { title: "Approve", desc: "Insurer approves with full audit trail and notifications." },
  ];
  return (
    <section id="workflow" className="relative border-b">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-indigo-50/50 dark:to-indigo-900/10" />
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="text-2xl font-semibold md:text-3xl">Streamlined workflow</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">From submission to approval, every step is tracked and secure.</p>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const colors = [
              "from-blue-500/10 to-blue-600/5 border-blue-200/50",
              "from-emerald-500/10 to-emerald-600/5 border-emerald-200/50",
              "from-indigo-500/10 to-indigo-600/5 border-indigo-200/50",
              "from-purple-500/10 to-purple-600/5 border-purple-200/50",
            ];
            const gradientColors = [
              "from-primary to-sky-500",
              "from-emerald-500 to-teal-500",
              "from-indigo-500 to-violet-500",
              "from-purple-500 to-pink-500",
            ];
            return (
              <li key={s.title} className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br ${colors[i]} p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r text-sm font-bold text-white shadow-md ${gradientColors[i]}`}>{i + 1}</span>
                  Step {i + 1}
                </div>
                <div className="text-lg font-bold text-foreground">{s.title}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

