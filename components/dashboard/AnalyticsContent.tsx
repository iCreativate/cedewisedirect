"use client";

const MONTHLY_DATA = [
  { month: "Jan", submissions: 32, premiums: 4.2, approvals: 28, declines: 4 },
  { month: "Feb", submissions: 38, premiums: 5.1, approvals: 33, declines: 5 },
  { month: "Mar", submissions: 42, premiums: 5.8, approvals: 37, declines: 5 },
  { month: "Apr", submissions: 35, premiums: 4.9, approvals: 31, declines: 4 },
  { month: "May", submissions: 48, premiums: 6.5, approvals: 42, declines: 6 },
  { month: "Jun", submissions: 45, premiums: 6.2, approvals: 39, declines: 6 },
  { month: "Jul", submissions: 52, premiums: 7.1, approvals: 46, declines: 6 },
  { month: "Aug", submissions: 58, premiums: 7.9, approvals: 51, declines: 7 },
  { month: "Sep", submissions: 55, premiums: 7.5, approvals: 48, declines: 7 },
  { month: "Oct", submissions: 62, premiums: 8.4, approvals: 54, declines: 8 },
  { month: "Nov", submissions: 68, premiums: 9.2, approvals: 60, declines: 8 },
  { month: "Dec", submissions: 72, premiums: 9.8, approvals: 64, declines: 8 },
];

const RISK_TYPE_DATA = [
  { type: "Property", count: 245, percentage: 58, premium: 125.5 },
  { type: "Liability", count: 142, percentage: 34, premium: 68.2 },
  { type: "Business Interruption", count: 28, percentage: 7, premium: 42.8 },
  { type: "Other", count: 7, percentage: 1, premium: 5.3 },
];

const TOP_CLIENTS = [
  { name: "ABC Corporation", submissions: 24, totalPremium: 12.5, status: "active" },
  { name: "Global Tech Ltd", submissions: 18, totalPremium: 9.8, status: "active" },
  { name: "Retail Group SA", submissions: 15, totalPremium: 8.2, status: "active" },
  { name: "XYZ Industries", submissions: 12, totalPremium: 6.5, status: "active" },
  { name: "Manufacturing Co", submissions: 10, totalPremium: 5.2, status: "active" },
];

const PERFORMANCE_METRICS = [
  { label: "Avg Processing Time", value: "3.2 days", trend: "-15%", status: "positive" },
  { label: "Approval Rate", value: "88.5%", trend: "+2.3%", status: "positive" },
  { label: "Client Retention", value: "94%", trend: "+5%", status: "positive" },
  { label: "Premium Growth", value: "+18.5%", trend: "+4.2%", status: "positive" },
];

const TREND_DATA = [
  { period: "Q1 2024", submissions: 112, premiums: 15.1 },
  { period: "Q2 2024", submissions: 143, premiums: 19.6 },
  { period: "Q3 2024", submissions: 165, premiums: 22.5 },
  { period: "Q4 2024", submissions: 202, premiums: 27.4 },
];

function SimpleBarChart({ data, maxValue, color = "bg-blue-500" }: { data: number[]; maxValue: number; color?: string }) {
  return (
    <div className="flex h-32 items-end justify-between gap-1">
      {data.map((value, idx) => {
        const height = (value / maxValue) * 100;
        return (
          <div key={idx} className="flex flex-1 flex-col items-center">
            <div className="relative flex h-full w-full items-end justify-center">
              <div
                className={`w-full rounded-t ${color} transition-all hover:opacity-80`}
                style={{ height: `${height}%` }}
                title={`${value}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SimpleLineChart({ data, maxValue }: { data: number[]; maxValue: number }) {
  const points = data.map((value, idx) => {
    const x = (idx / (data.length - 1)) * 100;
    const y = 100 - (value / maxValue) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="h-32 w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
          points={points}
        />
        <polygon
          fill="rgba(59, 130, 246, 0.1)"
          points={`0,100 ${points} 100,100`}
        />
      </svg>
    </div>
  );
}

export default function AnalyticsContent() {
  const maxSubmissions = Math.max(...MONTHLY_DATA.map(d => d.submissions));
  const maxPremiums = Math.max(...MONTHLY_DATA.map(d => d.premiums));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Total Submissions</div>
          <div className="mt-1 text-2xl font-semibold">{MONTHLY_DATA.reduce((sum, d) => sum + d.submissions, 0)}</div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+24% vs last year</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Total Premium Volume</div>
          <div className="mt-1 text-2xl font-semibold">R {(MONTHLY_DATA.reduce((sum, d) => sum + d.premiums, 0) * 10).toFixed(1)}M</div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+18.5% vs last year</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Approval Rate</div>
          <div className="mt-1 text-2xl font-semibold">88.5%</div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+2.3% vs last quarter</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Active Clients</div>
          <div className="mt-1 text-2xl font-semibold">142</div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+12 new this month</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PERFORMANCE_METRICS.map((metric) => (
          <div key={metric.label} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="text-xs text-muted-foreground">{metric.label}</div>
            <div className="mt-1 text-xl font-semibold">{metric.value}</div>
            <div className={`mt-1 text-xs ${metric.status === "positive" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {metric.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Submissions Chart */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold">Monthly Submissions Trend</h3>
            <p className="text-xs text-muted-foreground">Last 12 months</p>
          </div>
          <SimpleBarChart
            data={MONTHLY_DATA.map(d => d.submissions)}
            maxValue={maxSubmissions}
            color="bg-blue-500"
          />
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            {MONTHLY_DATA.slice(0, 6).map((d) => (
              <span key={d.month}>{d.month}</span>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            {MONTHLY_DATA.slice(6).map((d) => (
              <span key={d.month}>{d.month}</span>
            ))}
          </div>
        </div>

        {/* Premium Volume Chart */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold">Premium Volume (Millions)</h3>
            <p className="text-xs text-muted-foreground">Last 12 months</p>
          </div>
          <SimpleLineChart
            data={MONTHLY_DATA.map(d => d.premiums)}
            maxValue={maxPremiums}
          />
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            {MONTHLY_DATA.slice(0, 6).map((d) => (
              <span key={d.month}>{d.month}</span>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            {MONTHLY_DATA.slice(6).map((d) => (
              <span key={d.month}>{d.month}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Type Distribution */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold">Risk Type Distribution</h3>
          <p className="text-xs text-muted-foreground">Breakdown by risk category</p>
        </div>
        <div className="space-y-4">
          {RISK_TYPE_DATA.map((item) => (
            <div key={item.type} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.type}</span>
                  <span className="text-xs text-muted-foreground">({item.count} submissions)</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">R {item.premium.toFixed(1)}M</div>
                  <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${
                    item.type === "Property" ? "bg-blue-500" :
                    item.type === "Liability" ? "bg-emerald-500" :
                    item.type === "Business Interruption" ? "bg-amber-500" : "bg-purple-500"
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quarterly Trends and Top Clients */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quarterly Trends */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold">Quarterly Performance</h3>
            <p className="text-xs text-muted-foreground">2024 quarterly breakdown</p>
          </div>
          <div className="space-y-4">
            {TREND_DATA.map((quarter) => (
              <div key={quarter.period} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="text-sm font-medium">{quarter.period}</div>
                  <div className="text-xs text-muted-foreground">{quarter.submissions} submissions</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">R {(quarter.premiums * 10).toFixed(1)}M</div>
                  <div className="text-xs text-muted-foreground">premium volume</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clients */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold">Top Clients</h3>
            <p className="text-xs text-muted-foreground">By premium volume</p>
          </div>
          <div className="space-y-3">
            {TOP_CLIENTS.map((client, idx) => (
              <div key={client.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{client.name}</div>
                    <div className="text-xs text-muted-foreground">{client.submissions} submissions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">R {client.totalPremium.toFixed(1)}M</div>
                  <div className={`text-xs ${client.status === "active" ? "text-emerald-600" : "text-muted-foreground"}`}>
                    {client.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approval vs Decline Trend */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold">Approvals Trend</h3>
            <p className="text-xs text-muted-foreground">Last 12 months</p>
          </div>
          <SimpleBarChart
            data={MONTHLY_DATA.map(d => d.approvals)}
            maxValue={maxSubmissions}
            color="bg-emerald-500"
          />
          <div className="mt-3 text-xs text-muted-foreground">
            Total: {MONTHLY_DATA.reduce((sum, d) => sum + d.approvals, 0)} approvals
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold">Declines Trend</h3>
            <p className="text-xs text-muted-foreground">Last 12 months</p>
          </div>
          <SimpleBarChart
            data={MONTHLY_DATA.map(d => d.declines)}
            maxValue={10}
            color="bg-red-500"
          />
          <div className="mt-3 text-xs text-muted-foreground">
            Total: {MONTHLY_DATA.reduce((sum, d) => sum + d.declines, 0)} declines
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold">Key Insights</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium">Strong Growth</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Premium volume has increased by 18.5% compared to last year, driven primarily by Property and Liability risks.
            </p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-sm font-medium">Efficiency Improvement</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Average processing time has decreased by 15% this quarter, improving customer satisfaction.
            </p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-sm font-medium">Market Opportunity</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Business Interruption coverage shows potential for growth, currently representing only 7% of portfolio.
            </p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="text-sm font-medium">Client Retention</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Client retention rate of 94% indicates strong relationships and service quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
