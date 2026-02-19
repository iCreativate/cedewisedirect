"use client";
import { useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Building2,
  Search,
  Filter,
  X,
  Eye,
  Download,
  TrendingUp,
  Activity,
  Shield,
  FileCheck,
  FileX,
} from "lucide-react";
import { formatDate } from "@/lib/dateUtils";

const AUDITS = [
  {
    id: "AUD-001",
    title: "Annual Compliance Audit - ABC Corporation",
    type: "Compliance",
    client: "ABC Corporation",
    clientId: "CLI-001",
    status: "completed",
    priority: "High",
    auditor: "John Smith",
    assignedDate: "2024-11-01",
    startDate: "2024-11-05",
    completedDate: "2024-12-10",
    dueDate: "2024-12-15",
    findings: 12,
    criticalFindings: 2,
    recommendations: 8,
    complianceScore: 85,
    riskLevel: "Medium",
    attachments: 5,
    tags: ["Annual", "Regulatory"],
  },
  {
    id: "AUD-002",
    title: "Risk Assessment Audit - XYZ Industries",
    type: "Risk Assessment",
    client: "XYZ Industries",
    clientId: "CLI-002",
    status: "in_progress",
    priority: "High",
    auditor: "Sarah Johnson",
    assignedDate: "2024-11-15",
    startDate: "2024-11-20",
    completedDate: null,
    dueDate: "2024-12-20",
    findings: 8,
    criticalFindings: 1,
    recommendations: 5,
    complianceScore: null,
    riskLevel: "Medium",
    attachments: 3,
    tags: ["Risk Assessment"],
  },
  {
    id: "AUD-003",
    title: "Policy Review Audit - Global Tech Ltd",
    type: "Policy Review",
    client: "Global Tech Ltd",
    clientId: "CLI-003",
    status: "pending",
    priority: "Medium",
    auditor: "Michael Brown",
    assignedDate: "2024-12-01",
    startDate: null,
    completedDate: null,
    dueDate: "2024-12-25",
    findings: 0,
    criticalFindings: 0,
    recommendations: 0,
    complianceScore: null,
    riskLevel: "Low",
    attachments: 0,
    tags: ["Policy Review"],
  },
  {
    id: "AUD-004",
    title: "Claims Processing Audit - Retail Group SA",
    type: "Claims Audit",
    client: "Retail Group SA",
    clientId: "CLI-004",
    status: "completed",
    priority: "Medium",
    auditor: "Emily Davis",
    assignedDate: "2024-10-15",
    startDate: "2024-10-20",
    completedDate: "2024-11-30",
    dueDate: "2024-11-30",
    findings: 15,
    criticalFindings: 3,
    recommendations: 10,
    complianceScore: 78,
    riskLevel: "High",
    attachments: 7,
    tags: ["Claims", "Processing"],
  },
  {
    id: "AUD-005",
    title: "Underwriting Standards Audit - Manufacturing Co",
    type: "Underwriting",
    client: "Manufacturing Co",
    clientId: "CLI-005",
    status: "in_progress",
    priority: "High",
    auditor: "David Wilson",
    assignedDate: "2024-11-20",
    startDate: "2024-11-25",
    completedDate: null,
    dueDate: "2024-12-28",
    findings: 10,
    criticalFindings: 2,
    recommendations: 6,
    complianceScore: null,
    riskLevel: "High",
    attachments: 4,
    tags: ["Underwriting", "Standards"],
  },
  {
    id: "AUD-006",
    title: "Data Security Audit - Logistics Solutions",
    type: "Security",
    client: "Logistics Solutions",
    clientId: "CLI-006",
    status: "completed",
    priority: "High",
    auditor: "Lisa Anderson",
    assignedDate: "2024-09-10",
    startDate: "2024-09-15",
    completedDate: "2024-10-25",
    dueDate: "2024-10-30",
    findings: 20,
    criticalFindings: 5,
    recommendations: 15,
    complianceScore: 72,
    riskLevel: "High",
    attachments: 9,
    tags: ["Security", "Data Protection"],
  },
  {
    id: "AUD-007",
    title: "Financial Controls Audit - TechStart Inc",
    type: "Financial",
    client: "TechStart Inc",
    clientId: "CLI-007",
    status: "pending",
    priority: "Medium",
    auditor: "Robert Taylor",
    assignedDate: "2024-12-05",
    startDate: null,
    completedDate: null,
    dueDate: "2025-01-15",
    findings: 0,
    criticalFindings: 0,
    recommendations: 0,
    complianceScore: null,
    riskLevel: "Low",
    attachments: 0,
    tags: ["Financial", "Controls"],
  },
  {
    id: "AUD-008",
    title: "Operational Risk Audit - Mining Operations Ltd",
    type: "Operational Risk",
    client: "Mining Operations Ltd",
    clientId: "CLI-008",
    status: "in_progress",
    priority: "High",
    auditor: "Jennifer Martinez",
    assignedDate: "2024-11-10",
    startDate: "2024-11-15",
    completedDate: null,
    dueDate: "2024-12-30",
    findings: 18,
    criticalFindings: 4,
    recommendations: 12,
    complianceScore: null,
    riskLevel: "High",
    attachments: 6,
    tags: ["Operational", "Risk"],
  },
  {
    id: "AUD-009",
    title: "Renewal Audit - Agricultural Holdings",
    type: "Renewal",
    client: "Agricultural Holdings",
    clientId: "CLI-009",
    status: "completed",
    priority: "Medium",
    auditor: "James White",
    assignedDate: "2024-10-01",
    startDate: "2024-10-05",
    completedDate: "2024-11-15",
    dueDate: "2024-11-20",
    findings: 6,
    criticalFindings: 0,
    recommendations: 4,
    complianceScore: 92,
    riskLevel: "Low",
    attachments: 3,
    tags: ["Renewal"],
  },
  {
    id: "AUD-010",
    title: "Documentation Audit - Hospitality Group",
    type: "Documentation",
    client: "Hospitality Group",
    clientId: "CLI-010",
    status: "completed",
    priority: "Low",
    auditor: "Patricia Lee",
    assignedDate: "2024-09-20",
    startDate: "2024-09-25",
    completedDate: "2024-10-20",
    dueDate: "2024-10-25",
    findings: 5,
    criticalFindings: 0,
    recommendations: 3,
    complianceScore: 88,
    riskLevel: "Low",
    attachments: 2,
    tags: ["Documentation"],
  },
  {
    id: "AUD-011",
    title: "Compliance Audit - Construction Partners",
    type: "Compliance",
    client: "Construction Partners",
    clientId: "CLI-011",
    status: "pending",
    priority: "High",
    auditor: "Thomas Harris",
    assignedDate: "2024-12-10",
    startDate: null,
    completedDate: null,
    dueDate: "2025-01-20",
    findings: 0,
    criticalFindings: 0,
    recommendations: 0,
    complianceScore: null,
    riskLevel: "High",
    attachments: 0,
    tags: ["Compliance", "Regulatory"],
  },
  {
    id: "AUD-012",
    title: "Internal Controls Audit - Energy Solutions",
    type: "Internal Controls",
    client: "Energy Solutions",
    clientId: "CLI-012",
    status: "completed",
    priority: "Medium",
    auditor: "Maria Garcia",
    assignedDate: "2024-10-05",
    startDate: "2024-10-10",
    completedDate: "2024-11-25",
    dueDate: "2024-11-30",
    findings: 11,
    criticalFindings: 1,
    recommendations: 7,
    complianceScore: 82,
    riskLevel: "Medium",
    attachments: 5,
    tags: ["Internal Controls"],
  },
];

const STATUS_OPTIONS = ["All Statuses", "Completed", "In Progress", "Pending"];
const TYPE_OPTIONS = [
  "All Types",
  "Compliance",
  "Risk Assessment",
  "Policy Review",
  "Claims Audit",
  "Underwriting",
  "Security",
  "Financial",
  "Operational Risk",
  "Renewal",
  "Documentation",
  "Internal Controls",
];
const PRIORITY_OPTIONS = ["All Priorities", "High", "Medium", "Low"];

function getStatusBadge(status: string) {
  const config = {
    completed: {
      label: "Completed",
      color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-400",
      icon: CheckCircle2,
    },
    in_progress: {
      label: "In Progress",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400",
      icon: Activity,
    },
    pending: {
      label: "Pending",
      color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-400",
      icon: Clock,
    },
  };
  const statusConfig = config[status as keyof typeof config] || config.pending;
  const Icon = statusConfig.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusConfig.color}`}>
      <Icon className="h-3 w-3" />
      {statusConfig.label}
    </span>
  );
}

function getPriorityBadge(priority: string) {
  const config = {
    High: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400" },
    Medium: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-400" },
    Low: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400" },
  };
  const priorityConfig = config[priority as keyof typeof config] || config.Medium;
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${priorityConfig.color}`}>
      {priority}
    </span>
  );
}

function getRiskLevelBadge(riskLevel: string) {
  const config = {
    Low: { color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-400" },
    Medium: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-400" },
    High: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400" },
  };
  const riskConfig = config[riskLevel as keyof typeof config] || config.Medium;
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${riskConfig.color}`}>
      {riskLevel}
    </span>
  );
}

export default function AuditsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);

  const filteredAudits = AUDITS.filter((audit) => {
    const matchesSearch =
      audit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.auditor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All Statuses" ||
      audit.status === selectedStatus.toLowerCase().replace(" ", "_") ||
      (selectedStatus === "In Progress" && audit.status === "in_progress");
    const matchesType = selectedType === "All Types" || audit.type === selectedType;
    const matchesPriority = selectedPriority === "All Priorities" || audit.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const selectedAuditData = selectedAudit ? AUDITS.find((a) => a.id === selectedAudit) : null;

  const stats = {
    total: AUDITS.length,
    completed: AUDITS.filter((a) => a.status === "completed").length,
    inProgress: AUDITS.filter((a) => a.status === "in_progress").length,
    pending: AUDITS.filter((a) => a.status === "pending").length,
    totalFindings: AUDITS.reduce((sum, a) => sum + a.findings, 0),
    criticalFindings: AUDITS.reduce((sum, a) => sum + a.criticalFindings, 0),
    totalRecommendations: AUDITS.reduce((sum, a) => sum + a.recommendations, 0),
    avgComplianceScore: Math.round(
      AUDITS.filter((a) => a.complianceScore !== null).reduce((sum, a) => sum + (a.complianceScore || 0), 0) /
        AUDITS.filter((a) => a.complianceScore !== null).length
    ),
  };

  const statusCounts = {
    completed: AUDITS.filter((a) => a.status === "completed").length,
    in_progress: AUDITS.filter((a) => a.status === "in_progress").length,
    pending: AUDITS.filter((a) => a.status === "pending").length,
  };

  const typeCounts = AUDITS.reduce((acc, audit) => {
    acc[audit.type] = (acc[audit.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Total Audits</div>
              <div className="mt-1 text-2xl font-semibold">{stats.total}</div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+2 this month</div>
            </div>
            <ClipboardList className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Completed</div>
              <div className="mt-1 text-2xl font-semibold">{stats.completed}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {Math.round((stats.completed / stats.total) * 100)}% of total
              </div>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">In Progress</div>
              <div className="mt-1 text-2xl font-semibold">{stats.inProgress}</div>
              <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">Requires attention</div>
            </div>
            <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Pending</div>
              <div className="mt-1 text-2xl font-semibold">{stats.pending}</div>
              <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">Awaiting start</div>
            </div>
            <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Total Findings</div>
          <div className="mt-1 text-xl font-semibold">{stats.totalFindings}</div>
          <div className="mt-1 text-xs text-muted-foreground">Across all audits</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Critical Findings</div>
          <div className="mt-1 text-xl font-semibold">{stats.criticalFindings}</div>
          <div className="mt-1 text-xs text-red-600 dark:text-red-400">Requires immediate action</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Total Recommendations</div>
          <div className="mt-1 text-xl font-semibold">{stats.totalRecommendations}</div>
          <div className="mt-1 text-xs text-muted-foreground">Improvement suggestions</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Avg Compliance Score</div>
          <div className="mt-1 text-xl font-semibold">{stats.avgComplianceScore}%</div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">Above threshold</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">Audits</h3>
          <button className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <ClipboardList className="h-4 w-4" />
            New Audit
          </button>
        </div>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search audits by title, client, or auditor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border bg-background pl-10 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {PRIORITY_OPTIONS.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
            <div className="ml-auto text-xs text-muted-foreground">
              Showing {filteredAudits.length} of {AUDITS.length} audits
            </div>
          </div>
        </div>
      </div>

      {/* Audits List */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-4">
          <h3 className="text-base font-semibold">All Audits</h3>
        </div>
        <div className="divide-y">
          {filteredAudits.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No audits found matching your search criteria.</div>
          ) : (
            filteredAudits.map((audit) => (
              <div
                key={audit.id}
                className={`p-4 transition-colors hover:bg-muted/50 ${
                  selectedAudit === audit.id ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-start gap-4">
                    <div className="rounded-lg border bg-muted p-3">
                      <ClipboardList className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-sm font-semibold">{audit.title}</h4>
                        {getStatusBadge(audit.status)}
                        {getPriorityBadge(audit.priority)}
                        {getRiskLevelBadge(audit.riskLevel)}
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {audit.type}
                        </span>
                      </div>
                      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-3 w-3" />
                          <span>{audit.client}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3" />
                          <span>Auditor: {audit.auditor}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          <span>Due: {formatDate(audit.dueDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3 w-3" />
                          <span>{audit.attachments} attachments</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        {audit.findings > 0 && (
                          <div className="flex items-center gap-1.5">
                            <AlertCircle className="h-3 w-3" />
                            <span>
                              {audit.findings} findings {audit.criticalFindings > 0 && `(${audit.criticalFindings} critical)`}
                            </span>
                          </div>
                        )}
                        {audit.recommendations > 0 && (
                          <div className="flex items-center gap-1.5">
                            <FileCheck className="h-3 w-3" />
                            <span>{audit.recommendations} recommendations</span>
                          </div>
                        )}
                        {audit.complianceScore !== null && (
                          <div className="flex items-center gap-1.5">
                            <Shield className="h-3 w-3" />
                            <span>Compliance: {audit.complianceScore}%</span>
                          </div>
                        )}
                        {audit.startDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            <span>Started: {formatDate(audit.startDate)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {audit.tags.map((tag, idx) => (
                          <span key={idx} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAudit(selectedAudit === audit.id ? null : audit.id)}
                      className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      title="Download Report"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedAudit === audit.id && (
                  <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                    <h5 className="mb-3 text-sm font-semibold">Audit Details</h5>
                    <div className="grid gap-4 text-sm md:grid-cols-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Audit ID</div>
                        <div className="mt-1 font-medium">{audit.id}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Type</div>
                        <div className="mt-1 font-medium">{audit.type}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Client</div>
                        <div className="mt-1 font-medium">{audit.client}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Client ID</div>
                        <div className="mt-1 font-medium">{audit.clientId}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Auditor</div>
                        <div className="mt-1 font-medium">{audit.auditor}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Priority</div>
                        <div className="mt-1">{getPriorityBadge(audit.priority)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Risk Level</div>
                        <div className="mt-1">{getRiskLevelBadge(audit.riskLevel)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Status</div>
                        <div className="mt-1">{getStatusBadge(audit.status)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Assigned Date</div>
                        <div className="mt-1 font-medium">{formatDate(audit.assignedDate)}</div>
                      </div>
                      {audit.startDate && (
                        <div>
                          <div className="text-xs text-muted-foreground">Start Date</div>
                          <div className="mt-1 font-medium">{formatDate(audit.startDate)}</div>
                        </div>
                      )}
                      {audit.completedDate && (
                        <div>
                          <div className="text-xs text-muted-foreground">Completed Date</div>
                          <div className="mt-1 font-medium">{formatDate(audit.completedDate)}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-muted-foreground">Due Date</div>
                        <div className="mt-1 font-medium">{formatDate(audit.dueDate)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Findings</div>
                        <div className="mt-1 font-medium">
                          {audit.findings} total {audit.criticalFindings > 0 && `(${audit.criticalFindings} critical)`}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Recommendations</div>
                        <div className="mt-1 font-medium">{audit.recommendations}</div>
                      </div>
                      {audit.complianceScore !== null && (
                        <div>
                          <div className="text-xs text-muted-foreground">Compliance Score</div>
                          <div className="mt-1 font-medium">{audit.complianceScore}%</div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-muted-foreground">Attachments</div>
                        <div className="mt-1 font-medium">{audit.attachments}</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-xs text-muted-foreground mb-2">Tags</div>
                      <div className="flex flex-wrap gap-2">
                        {audit.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Statistics Panels */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold">Audits by Status</h3>
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = (count / AUDITS.length) * 100;
              return (
                <div key={status} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{status.replace("_", " ")}</span>
                    <span className="text-muted-foreground">{count} audits</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${
                        status === "completed"
                          ? "bg-emerald-500"
                          : status === "in_progress"
                          ? "bg-blue-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold">Audits by Type</h3>
          <div className="space-y-3">
            {Object.entries(typeCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([type, count]) => {
                const percentage = (count / AUDITS.length) * 100;
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{type}</span>
                      <span className="text-muted-foreground">{count} audits</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

