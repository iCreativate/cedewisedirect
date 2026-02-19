import DashboardShell from "@/components/layout/DashboardShell";
import KPIs from "@/components/dashboard/KPIs";
import TasksTable from "@/components/dashboard/TasksTable";
import Link from "next/link";

export default function BrokerDashboard() {
  return (
    <DashboardShell title="Broker Dashboard">
      <div className="space-y-6">
        <KPIs items={[
          { label: "Total Submissions", value: "42", trend: "+15%" },
          { label: "Pending Review", value: "8" },
          { label: "Approved", value: "28" },
          { label: "This Month", value: "12", trend: "+20%" },
          { label: "Total Coverage", value: "R 2.4B", trend: "+8%" },
          { label: "Active Clients", value: "34" },
          { label: "Declined", value: "4" },
          { label: "Avg. Processing Time", value: "3.2 days", trend: "-15%" },
        ]} />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">Recent Submissions</h2>
              <Link href="/dashboard/broker/submissions/new" className="btn-primary">
                New submission
              </Link>
            </div>
            <TasksTable />
          </div>
          <div className="space-y-4">
            <h2 className="text-base font-medium">Upcoming Renewals</h2>
            <div className="card-modern p-6">
              <div className="space-y-3">
                {[
                  { submission: "POL-20241215-0001", client: "ABC Corporation", deadline: "2024-12-20", status: "pending" },
                  { submission: "POL-20241214-0032", client: "XYZ Industries", deadline: "2024-12-22", status: "in-progress" },
                  { submission: "POL-20241213-0021", client: "Global Tech Ltd", deadline: "2024-12-25", status: "pending" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="text-sm font-medium">{item.submission}</div>
                      <div className="text-xs text-muted-foreground">{item.client}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium">{item.deadline}</div>
                      <div className={`text-xs ${item.status === "pending" ? "text-amber-600" : "text-blue-600"}`}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-medium">Quick Stats</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="card-modern p-4">
                  <div className="text-xs text-muted-foreground">Avg Premium</div>
                  <div className="mt-1 text-lg font-semibold">R 245,000</div>
                </div>
                <div className="card-modern p-4">
                  <div className="text-xs text-muted-foreground">Completion Rate</div>
                  <div className="mt-1 text-lg font-semibold">87%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

