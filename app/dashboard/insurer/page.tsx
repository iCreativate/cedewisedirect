import DashboardShell from "@/components/layout/DashboardShell";
import KPIs from "@/components/dashboard/KPIs";
import TasksTable from "@/components/dashboard/TasksTable";
import Link from "next/link";

export default function InsurerDashboard() {
  return (
    <DashboardShell title="Dashboard">
      <div className="space-y-6">
        <KPIs items={[
          { label: "Pending", value: "3" },
          { label: "Approved", value: "12" },
          { label: "Declined", value: "1" },
          { label: "This Month", value: "7", trend: "+12%" },
        ]} />
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Queue</h2>
          <Link href="/dashboard/insurer/submissions/new" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">New submission</Link>
        </div>
        <TasksTable />
      </div>
    </DashboardShell>
  );
}

