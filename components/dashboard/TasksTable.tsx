"use client";
import { trpc } from "@/lib/trpcClient";
import { useState } from "react";
import { formatDate } from "@/lib/dateUtils";
import { useRouter } from "next/navigation";

const MOCK_SUBMISSIONS = [
  {
    id: "POL-20241215-0001",
    title: "Commercial Property - ABC Corporation",
    clientName: "ABC Corporation",
    status: "PENDING",
    riskType: "Property",
    coverageAmount: 15000000,
    createdAt: "2024-12-15",
    premiumEstimate: 245000,
  },
  {
    id: "POL-20241214-0032",
    title: "Liability Coverage - XYZ Industries",
    clientName: "XYZ Industries",
    status: "UNDER_REVIEW",
    riskType: "Liability",
    coverageAmount: 8500000,
    createdAt: "2024-12-14",
    premiumEstimate: 180000,
  },
  {
    id: "POL-20241213-0021",
    title: "Property & Business Interruption - Global Tech Ltd",
    clientName: "Global Tech Ltd",
    status: "APPROVED",
    riskType: "Property",
    coverageAmount: 32000000,
    createdAt: "2024-12-13",
    premiumEstimate: 520000,
  },
  {
    id: "POL-20241212-0015",
    title: "Professional Liability - TechStart Inc",
    clientName: "TechStart Inc",
    status: "PENDING",
    riskType: "Liability",
    coverageAmount: 12000000,
    createdAt: "2024-12-12",
    premiumEstimate: 195000,
  },
  {
    id: "POL-20241211-0008",
    title: "Commercial Property Portfolio - Retail Group SA",
    clientName: "Retail Group SA",
    status: "APPROVED",
    riskType: "Property",
    coverageAmount: 45000000,
    createdAt: "2024-12-11",
    premiumEstimate: 780000,
  },
  {
    id: "POL-20241210-0042",
    title: "General Liability - Manufacturing Co",
    clientName: "Manufacturing Co",
    status: "UNDER_REVIEW",
    riskType: "Liability",
    coverageAmount: 6500000,
    createdAt: "2024-12-10",
    premiumEstimate: 125000,
  },
  {
    id: "POL-20241209-0033",
    title: "Property Damage - Logistics Solutions",
    clientName: "Logistics Solutions",
    status: "APPROVED",
    riskType: "Property",
    coverageAmount: 18500000,
    createdAt: "2024-12-09",
    premiumEstimate: 310000,
  },
];

function getStatusBadge(status: string) {
  const styles = {
    PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    UNDER_REVIEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    APPROVED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    DECLINED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm ${styles[status as keyof typeof styles] || styles.PENDING}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function TasksTable() {
  const router = useRouter();
  const { data, isLoading } = trpc.mySubmissions.useQuery();
  const [showAll, setShowAll] = useState(false);
  
  // Use mock data if no database data, or merge them
  const dbRows = Array.isArray(data) ? data : [];
  const allRows = dbRows.length > 0 ? dbRows : MOCK_SUBMISSIONS;
  const rows = showAll ? allRows : allRows.slice(0, 5);
  
  const handleRowClick = (submissionId: string) => {
    router.push(`/dashboard/submissions/${submissionId}`);
  };
  
  return (
    <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">My Submissions</h3>
          <p className="mt-1 text-xs text-muted-foreground">Track and manage your insurance submissions</p>
        </div>
        {!isLoading && allRows.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground transition-all duration-200 hover:bg-accent hover:border-primary/20 hover:shadow-sm"
          >
            {showAll ? "Show less" : `Show all (${allRows.length})`}
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      ) : rows.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-sm text-muted-foreground">No submissions yet.</div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/40 bg-background/50">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Policy No</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Risk Type</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Coverage</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Premium</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {rows.map((s: any, idx: number) => {
                const submissionId = s.id || s.policyNo || idx.toString();
                return (
                <tr
                  key={submissionId}
                  onClick={() => handleRowClick(submissionId)}
                  className="transition-all duration-200 hover:bg-primary/5 hover:shadow-sm cursor-pointer"
                >
                  <td className="px-4 py-4 align-top">
                    <div className="font-mono text-xs font-semibold text-primary">{s.id || s.policyNo || "N/A"}</div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="font-semibold text-foreground">{s.clientName}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{s.title?.substring(0, 40)}...</div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                      {s.riskType || "Property"}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top text-right">
                    <div className="font-bold text-foreground">R {(s.coverageAmount || 0).toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-4 align-top text-right">
                    <div className="font-bold text-foreground">R {(s.premiumEstimate || 0).toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="text-xs font-medium text-muted-foreground">
                      {formatDate(s.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">{getStatusBadge(s.status || "PENDING")}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

