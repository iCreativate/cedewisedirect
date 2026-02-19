import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function KPIs({ items }: { items: { label: string; value: string; trend?: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((k, index) => {
        const isPositive = k.trend?.startsWith("+");
        const isNegative = k.trend?.startsWith("-");
        const colors = [
          "from-blue-500/10 to-blue-600/5 border-blue-200/50",
          "from-emerald-500/10 to-emerald-600/5 border-emerald-200/50",
          "from-purple-500/10 to-purple-600/5 border-purple-200/50",
          "from-amber-500/10 to-amber-600/5 border-amber-200/50",
          "from-cyan-500/10 to-cyan-600/5 border-cyan-200/50",
          "from-pink-500/10 to-pink-600/5 border-pink-200/50",
          "from-indigo-500/10 to-indigo-600/5 border-indigo-200/50",
          "from-orange-500/10 to-orange-600/5 border-orange-200/50",
        ];
        const colorClass = colors[index % colors.length];

        return (
          <div
            key={k.label}
            className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br ${colorClass} p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
          >
            <div className="relative z-10">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {k.label}
              </div>
              <div className="mb-2 text-3xl font-bold text-foreground">{k.value}</div>
              {k.trend ? (
                <div
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    isPositive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : isNegative
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : isNegative ? (
                    <TrendingDown className="h-3.5 w-3.5" />
                  ) : (
                    <Minus className="h-3.5 w-3.5" />
                  )}
                  <span>{k.trend}</span>
                </div>
              ) : null}
            </div>
            {/* Decorative gradient overlay */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        );
      })}
    </div>
  );
}

