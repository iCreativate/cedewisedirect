"use client";
import { useState } from "react";
import {
  FilePlus2,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  User,
  Calendar,
  Building2,
  Search,
  Filter,
  X,
  Eye,
  Edit,
  Download,
  Shield,
  DollarSign,
  TrendingUp,
  FileCheck,
  FileX,
} from "lucide-react";
import { formatDate } from "@/lib/dateUtils";
import { useRouter } from "next/navigation";

const SUBMISSIONS = [
  {
    id: "POL-20241215-0001",
    title: "Commercial Property - ABC Corporation",
    clientName: "ABC Corporation",
    clientId: "CLI-001",
    status: "PENDING",
    riskType: "Property",
    coverageAmount: 15000000,
    premiumEstimate: 245000,
    policyNo: "POL-20241215-0001",
    submittedDate: "2024-12-15",
    lastUpdated: "2024-12-15",
    dueDate: "2024-12-20",
    submittedBy: "John Smith",
    assignedTo: "Sarah Johnson",
    priority: "High",
    attachments: 3,
    tags: ["New Business", "Renewal"],
  },
  {
    id: "POL-20241214-0032",
    title: "Liability Coverage - XYZ Industries",
    clientName: "XYZ Industries",
    clientId: "CLI-002",
    status: "UNDER_REVIEW",
    riskType: "Liability",
    coverageAmount: 8500000,
    premiumEstimate: 180000,
    policyNo: "POL-20241214-0032",
    submittedDate: "2024-12-14",
    lastUpdated: "2024-12-16",
    dueDate: "2024-12-22",
    submittedBy: "Sarah Johnson",
    assignedTo: "Michael Brown",
    priority: "High",
    attachments: 5,
    tags: ["Amendment", "Under Review"],
  },
  {
    id: "POL-20241213-0021",
    title: "Property & Business Interruption - Global Tech Ltd",
    clientName: "Global Tech Ltd",
    clientId: "CLI-003",
    status: "APPROVED",
    riskType: "Property",
    coverageAmount: 32000000,
    premiumEstimate: 520000,
    policyNo: "POL-20241213-0021",
    submittedDate: "2024-12-13",
    lastUpdated: "2024-12-14",
    dueDate: "2024-12-18",
    submittedBy: "Michael Brown",
    assignedTo: "Emily Davis",
    priority: "Medium",
    attachments: 7,
    tags: ["Approved", "Premium Client"],
  },
  {
    id: "POL-20241212-0015",
    title: "Professional Liability - TechStart Inc",
    clientName: "TechStart Inc",
    clientId: "CLI-007",
    status: "PENDING",
    riskType: "Liability",
    coverageAmount: 12000000,
    premiumEstimate: 195000,
    policyNo: "POL-20241212-0015",
    submittedDate: "2024-12-12",
    lastUpdated: "2024-12-12",
    dueDate: "2024-12-19",
    submittedBy: "Robert Taylor",
    assignedTo: "David Wilson",
    priority: "Medium",
    attachments: 2,
    tags: ["SME", "New Business"],
  },
  {
    id: "POL-20241211-0008",
    title: "Commercial Property Portfolio - Retail Group SA",
    clientName: "Retail Group SA",
    clientId: "CLI-004",
    status: "APPROVED",
    riskType: "Property",
    coverageAmount: 45000000,
    premiumEstimate: 780000,
    policyNo: "POL-20241211-0008",
    submittedDate: "2024-12-11",
    lastUpdated: "2024-12-13",
    dueDate: "2024-12-16",
    submittedBy: "Emily Davis",
    assignedTo: "Lisa Anderson",
    priority: "High",
    attachments: 9,
    tags: ["Approved", "Portfolio", "Premium Client"],
  },
  {
    id: "POL-20241210-0042",
    title: "General Liability - Manufacturing Co",
    clientName: "Manufacturing Co",
    clientId: "CLI-005",
    status: "UNDER_REVIEW",
    riskType: "Liability",
    coverageAmount: 6500000,
    premiumEstimate: 125000,
    policyNo: "POL-20241210-0042",
    submittedDate: "2024-12-10",
    lastUpdated: "2024-12-15",
    dueDate: "2024-12-17",
    submittedBy: "David Wilson",
    assignedTo: "Jennifer Martinez",
    priority: "High",
    attachments: 4,
    tags: ["Under Review", "High Risk"],
  },
  {
    id: "POL-20241209-0033",
    title: "Property Damage - Logistics Solutions",
    clientName: "Logistics Solutions",
    clientId: "CLI-006",
    status: "APPROVED",
    riskType: "Property",
    coverageAmount: 18500000,
    premiumEstimate: 310000,
    policyNo: "POL-20241209-0033",
    submittedDate: "2024-12-09",
    lastUpdated: "2024-12-11",
    dueDate: "2024-12-14",
    submittedBy: "Lisa Anderson",
    assignedTo: "James White",
    priority: "Medium",
    attachments: 6,
    tags: ["Approved", "Standard"],
  },
  {
    id: "POL-20241208-0025",
    title: "Mining Operations Coverage - Mining Operations Ltd",
    clientName: "Mining Operations Ltd",
    clientId: "CLI-008",
    status: "UNDER_REVIEW",
    riskType: "Property",
    coverageAmount: 95000000,
    premiumEstimate: 2850000,
    policyNo: "POL-20241208-0025",
    submittedDate: "2024-12-08",
    lastUpdated: "2024-12-14",
    dueDate: "2024-12-20",
    submittedBy: "Jennifer Martinez",
    assignedTo: "Patricia Lee",
    priority: "High",
    attachments: 12,
    tags: ["Under Review", "High Risk", "Mining"],
  },
  {
    id: "POL-20241207-0018",
    title: "Agricultural Property - Agricultural Holdings",
    clientName: "Agricultural Holdings",
    clientId: "CLI-009",
    status: "APPROVED",
    riskType: "Property",
    coverageAmount: 42000000,
    premiumEstimate: 1150000,
    policyNo: "POL-20241207-0018",
    submittedDate: "2024-12-07",
    lastUpdated: "2024-12-10",
    dueDate: "2024-12-12",
    submittedBy: "James White",
    assignedTo: "Thomas Harris",
    priority: "Medium",
    attachments: 5,
    tags: ["Approved", "Agriculture"],
  },
  {
    id: "POL-20241206-0012",
    title: "Hospitality Property - Hospitality Group",
    clientName: "Hospitality Group",
    clientId: "CLI-010",
    status: "DECLINED",
    riskType: "Property",
    coverageAmount: 25000000,
    premiumEstimate: 680000,
    policyNo: "POL-20241206-0012",
    submittedDate: "2024-12-06",
    lastUpdated: "2024-12-09",
    dueDate: "2024-12-11",
    submittedBy: "Patricia Lee",
    assignedTo: "Maria Garcia",
    priority: "Medium",
    attachments: 3,
    tags: ["Declined", "High Risk"],
  },
  {
    id: "POL-20241205-0009",
    title: "Construction Liability - Construction Partners",
    clientName: "Construction Partners",
    clientId: "CLI-011",
    status: "PENDING",
    riskType: "Liability",
    coverageAmount: 15000000,
    premiumEstimate: 420000,
    policyNo: "POL-20241205-0009",
    submittedDate: "2024-12-05",
    lastUpdated: "2024-12-05",
    dueDate: "2024-12-12",
    submittedBy: "Thomas Harris",
    assignedTo: "John Smith",
    priority: "High",
    attachments: 4,
    tags: ["SME", "High Risk", "Construction"],
  },
  {
    id: "POL-20241204-0005",
    title: "Energy Sector Coverage - Energy Solutions",
    clientName: "Energy Solutions",
    clientId: "CLI-012",
    status: "APPROVED",
    riskType: "Property",
    coverageAmount: 72000000,
    premiumEstimate: 2100000,
    policyNo: "POL-20241204-0005",
    submittedDate: "2024-12-04",
    lastUpdated: "2024-12-08",
    dueDate: "2024-12-10",
    submittedBy: "Maria Garcia",
    assignedTo: "Sarah Johnson",
    priority: "High",
    attachments: 8,
    tags: ["Approved", "Premium Client", "Energy"],
  },
  {
    id: "POL-20241203-0003",
    title: "Business Interruption - ABC Corporation",
    clientName: "ABC Corporation",
    clientId: "CLI-001",
    status: "UNDER_REVIEW",
    riskType: "Property",
    coverageAmount: 8500000,
    premiumEstimate: 145000,
    policyNo: "POL-20241203-0003",
    submittedDate: "2024-12-03",
    lastUpdated: "2024-12-13",
    dueDate: "2024-12-15",
    submittedBy: "John Smith",
    assignedTo: "Michael Brown",
    priority: "Medium",
    attachments: 3,
    tags: ["Amendment", "Under Review"],
  },
  {
    id: "POL-20241202-0002",
    title: "Cyber Liability - Global Tech Ltd",
    clientName: "Global Tech Ltd",
    clientId: "CLI-003",
    status: "APPROVED",
    riskType: "Liability",
    coverageAmount: 18000000,
    premiumEstimate: 320000,
    policyNo: "POL-20241202-0002",
    submittedDate: "2024-12-02",
    lastUpdated: "2024-12-05",
    dueDate: "2024-12-08",
    submittedBy: "Michael Brown",
    assignedTo: "Emily Davis",
    priority: "Medium",
    attachments: 6,
    tags: ["Approved", "Cyber", "Technology"],
  },
  {
    id: "POL-20241201-0001",
    title: "Marine Cargo - Logistics Solutions",
    clientName: "Logistics Solutions",
    clientId: "CLI-006",
    status: "PENDING",
    riskType: "Property",
    coverageAmount: 12000000,
    premiumEstimate: 195000,
    policyNo: "POL-20241201-0001",
    submittedDate: "2024-12-01",
    lastUpdated: "2024-12-01",
    dueDate: "2024-12-08",
    submittedBy: "Lisa Anderson",
    assignedTo: "David Wilson",
    priority: "Medium",
    attachments: 2,
    tags: ["New Business", "Marine"],
  },
];

const STATUS_OPTIONS = ["All Statuses", "Pending", "Under Review", "Approved", "Declined"];
const RISK_TYPE_OPTIONS = ["All Types", "Property", "Liability"];
const PRIORITY_OPTIONS = ["All Priorities", "High", "Medium", "Low"];

function getStatusBadge(status: string) {
  const config = {
    PENDING: {
      label: "Pending",
      color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-400",
      icon: Clock,
    },
    UNDER_REVIEW: {
      label: "Under Review",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400",
      icon: FileText,
    },
    APPROVED: {
      label: "Approved",
      color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-400",
      icon: CheckCircle2,
    },
    DECLINED: {
      label: "Declined",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400",
      icon: XCircle,
    },
  };
  const statusConfig = config[status as keyof typeof config] || config.PENDING;
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

export default function SubmissionsContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedRiskType, setSelectedRiskType] = useState("All Types");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);

  const handleViewSubmission = (submissionId: string) => {
    router.push(`/dashboard/submissions/${submissionId}`);
  };

  const handleEditSubmission = (submissionId: string) => {
    router.push(`/dashboard/submissions/${submissionId}/edit`);
  };

  const filteredSubmissions = SUBMISSIONS.filter((submission) => {
    const matchesSearch =
      submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.policyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All Statuses" ||
      submission.status === selectedStatus.toUpperCase().replace(" ", "_") ||
      (selectedStatus === "Under Review" && submission.status === "UNDER_REVIEW");
    const matchesRiskType = selectedRiskType === "All Types" || submission.riskType === selectedRiskType;
    const matchesPriority = selectedPriority === "All Priorities" || submission.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesRiskType && matchesPriority;
  });

  const selectedSubmissionData = selectedSubmission
    ? SUBMISSIONS.find((s) => s.id === selectedSubmission)
    : null;

  const stats = {
    total: SUBMISSIONS.length,
    pending: SUBMISSIONS.filter((s) => s.status === "PENDING").length,
    underReview: SUBMISSIONS.filter((s) => s.status === "UNDER_REVIEW").length,
    approved: SUBMISSIONS.filter((s) => s.status === "APPROVED").length,
    declined: SUBMISSIONS.filter((s) => s.status === "DECLINED").length,
    totalCoverage: SUBMISSIONS.reduce((sum, s) => sum + s.coverageAmount, 0),
    totalPremium: SUBMISSIONS.reduce((sum, s) => sum + s.premiumEstimate, 0),
    highPriority: SUBMISSIONS.filter((s) => s.priority === "High").length,
  };

  const statusCounts = {
    PENDING: SUBMISSIONS.filter((s) => s.status === "PENDING").length,
    UNDER_REVIEW: SUBMISSIONS.filter((s) => s.status === "UNDER_REVIEW").length,
    APPROVED: SUBMISSIONS.filter((s) => s.status === "APPROVED").length,
    DECLINED: SUBMISSIONS.filter((s) => s.status === "DECLINED").length,
  };

  const riskTypeCounts = SUBMISSIONS.reduce((acc, submission) => {
    acc[submission.riskType] = (acc[submission.riskType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Total Submissions</div>
              <div className="mt-1 text-2xl font-semibold">{stats.total}</div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+5 this month</div>
            </div>
            <FilePlus2 className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Pending</div>
              <div className="mt-1 text-2xl font-semibold">{stats.pending}</div>
              <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">Requires attention</div>
            </div>
            <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Under Review</div>
              <div className="mt-1 text-2xl font-semibold">{stats.underReview}</div>
              <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">In progress</div>
            </div>
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Approved</div>
              <div className="mt-1 text-2xl font-semibold">{stats.approved}</div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                {Math.round((stats.approved / stats.total) * 100)}% of total
              </div>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Total Coverage</div>
          <div className="mt-1 text-xl font-semibold">R {(stats.totalCoverage / 1000000).toFixed(1)}M</div>
          <div className="mt-1 text-xs text-muted-foreground">Across all submissions</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Total Premium</div>
          <div className="mt-1 text-xl font-semibold">R {(stats.totalPremium / 1000000).toFixed(1)}M</div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+8% this month</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">High Priority</div>
          <div className="mt-1 text-xl font-semibold">{stats.highPriority}</div>
          <div className="mt-1 text-xs text-red-600 dark:text-red-400">Requires immediate action</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Declined</div>
          <div className="mt-1 text-xl font-semibold">{stats.declined}</div>
          <div className="mt-1 text-xs text-muted-foreground">Not approved</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">Submissions</h3>
          <button className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <FilePlus2 className="h-4 w-4" />
            New Submission
          </button>
        </div>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search submissions by title, client, policy number, or submitter..."
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
              value={selectedRiskType}
              onChange={(e) => setSelectedRiskType(e.target.value)}
              className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {RISK_TYPE_OPTIONS.map((type) => (
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
              Showing {filteredSubmissions.length} of {SUBMISSIONS.length} submissions
            </div>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-4">
          <h3 className="text-base font-semibold">All Submissions</h3>
        </div>
        <div className="divide-y">
          {filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No submissions found matching your search criteria.</div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className={`p-4 transition-colors hover:bg-muted/50 cursor-pointer ${
                  selectedSubmission === submission.id ? "bg-primary/5" : ""
                }`}
                onClick={() => handleViewSubmission(submission.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-start gap-4">
                    <div className="rounded-lg border bg-muted p-3">
                      <FilePlus2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-sm font-semibold">{submission.title}</h4>
                        {getStatusBadge(submission.status)}
                        {getPriorityBadge(submission.priority)}
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {submission.riskType}
                        </span>
                      </div>
                      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-3 w-3" />
                          <span>{submission.clientName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3 w-3" />
                          <span>Policy: {submission.policyNo}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3" />
                          <span>Submitted by: {submission.submittedBy}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(submission.submittedDate)}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Shield className="h-3 w-3" />
                          <span>Coverage: R {submission.coverageAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-3 w-3" />
                          <span>Premium: R {submission.premiumEstimate.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3" />
                          <span>Assigned to: {submission.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3 w-3" />
                          <span>{submission.attachments} attachments</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          <span>Due: {formatDate(submission.dueDate)}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {submission.tags.map((tag, idx) => (
                          <span key={idx} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewSubmission(submission.id);
                      }}
                      className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSubmission(submission.id);
                      }}
                      className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      title="Edit Submission"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedSubmission === submission.id && (
                  <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                    <h5 className="mb-3 text-sm font-semibold">Submission Details</h5>
                    <div className="grid gap-4 text-sm md:grid-cols-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Policy Number</div>
                        <div className="mt-1 font-medium">{submission.policyNo}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Status</div>
                        <div className="mt-1">{getStatusBadge(submission.status)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Client</div>
                        <div className="mt-1 font-medium">{submission.clientName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Client ID</div>
                        <div className="mt-1 font-medium">{submission.clientId}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Risk Type</div>
                        <div className="mt-1 font-medium">{submission.riskType}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Priority</div>
                        <div className="mt-1">{getPriorityBadge(submission.priority)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Coverage Amount</div>
                        <div className="mt-1 font-medium">R {submission.coverageAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Premium Estimate</div>
                        <div className="mt-1 font-medium">R {submission.premiumEstimate.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Submitted By</div>
                        <div className="mt-1 font-medium">{submission.submittedBy}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Assigned To</div>
                        <div className="mt-1 font-medium">{submission.assignedTo}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Submitted Date</div>
                        <div className="mt-1 font-medium">{formatDate(submission.submittedDate)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Last Updated</div>
                        <div className="mt-1 font-medium">{formatDate(submission.lastUpdated)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Due Date</div>
                        <div className="mt-1 font-medium">{formatDate(submission.dueDate)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Attachments</div>
                        <div className="mt-1 font-medium">{submission.attachments}</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-xs text-muted-foreground mb-2">Tags</div>
                      <div className="flex flex-wrap gap-2">
                        {submission.tags.map((tag, idx) => (
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
          <h3 className="mb-4 text-base font-semibold">Submissions by Status</h3>
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = (count / SUBMISSIONS.length) * 100;
              return (
                <div key={status} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{status.replace("_", " ")}</span>
                    <span className="text-muted-foreground">{count} submissions</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${
                        status === "APPROVED"
                          ? "bg-emerald-500"
                          : status === "UNDER_REVIEW"
                          ? "bg-blue-500"
                          : status === "PENDING"
                          ? "bg-amber-500"
                          : "bg-red-500"
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
          <h3 className="mb-4 text-base font-semibold">Submissions by Risk Type</h3>
          <div className="space-y-3">
            {Object.entries(riskTypeCounts).map(([type, count]) => {
              const percentage = (count / SUBMISSIONS.length) * 100;
              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{type}</span>
                    <span className="text-muted-foreground">{count} submissions</span>
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

