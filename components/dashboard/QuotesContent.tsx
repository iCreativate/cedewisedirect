"use client";
import { useState } from "react";
import {
  BadgeDollarSign,
  CheckCircle2,
  Clock,
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
  Send,
  Copy,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Shield,
} from "lucide-react";
import { formatDate } from "@/lib/dateUtils";

const QUOTES = [
  {
    id: "QTE-20241215-0001",
    quoteNumber: "QTE-20241215-0001",
    title: "Commercial Property Insurance - ABC Corporation",
    clientName: "ABC Corporation",
    clientId: "CLI-001",
    status: "SENT",
    riskType: "Property",
    coverageAmount: 15000000,
    premiumAmount: 245000,
    annualPremium: 245000,
    monthlyPremium: 20417,
    deductible: 50000,
    effectiveDate: "2025-01-01",
    expirationDate: "2025-12-31",
    quoteExpiryDate: "2024-12-22",
    createdDate: "2024-12-15",
    sentDate: "2024-12-15",
    lastUpdated: "2024-12-15",
    createdBy: "John Smith",
    coverage: ["Property Damage", "Business Interruption", "Liability"],
    attachments: 3,
    tags: ["New Business", "Premium Client"],
  },
  {
    id: "QTE-20241214-0032",
    quoteNumber: "QTE-20241214-0032",
    title: "Liability Coverage - XYZ Industries",
    clientName: "XYZ Industries",
    clientId: "CLI-002",
    status: "ACCEPTED",
    riskType: "Liability",
    coverageAmount: 8500000,
    premiumAmount: 180000,
    annualPremium: 180000,
    monthlyPremium: 15000,
    deductible: 25000,
    effectiveDate: "2025-01-15",
    expirationDate: "2025-12-31",
    quoteExpiryDate: "2024-12-21",
    createdDate: "2024-12-14",
    sentDate: "2024-12-14",
    acceptedDate: "2024-12-16",
    lastUpdated: "2024-12-16",
    createdBy: "Sarah Johnson",
    coverage: ["General Liability", "Professional Liability", "Product Liability"],
    attachments: 5,
    tags: ["Accepted", "Standard"],
  },
  {
    id: "QTE-20241213-0021",
    quoteNumber: "QTE-20241213-0021",
    title: "Property & Business Interruption - Global Tech Ltd",
    clientName: "Global Tech Ltd",
    clientId: "CLI-003",
    status: "DRAFT",
    riskType: "Property",
    coverageAmount: 32000000,
    premiumAmount: 520000,
    annualPremium: 520000,
    monthlyPremium: 43333,
    deductible: 100000,
    effectiveDate: "2025-02-01",
    expirationDate: "2025-12-31",
    quoteExpiryDate: "2024-12-20",
    createdDate: "2024-12-13",
    sentDate: null,
    lastUpdated: "2024-12-15",
    createdBy: "Michael Brown",
    coverage: ["Property Damage", "Business Interruption", "Cyber Liability"],
    attachments: 2,
    tags: ["Draft", "Premium Client"],
  },
  {
    id: "QTE-20241212-0015",
    quoteNumber: "QTE-20241212-0015",
    title: "Professional Liability - TechStart Inc",
    clientName: "TechStart Inc",
    clientId: "CLI-007",
    status: "SENT",
    riskType: "Liability",
    coverageAmount: 12000000,
    premiumAmount: 195000,
    annualPremium: 195000,
    monthlyPremium: 16250,
    deductible: 35000,
    effectiveDate: "2025-01-20",
    expirationDate: "2025-12-31",
    quoteExpiryDate: "2024-12-19",
    createdDate: "2024-12-12",
    sentDate: "2024-12-12",
    lastUpdated: "2024-12-12",
    createdBy: "Robert Taylor",
    coverage: ["Professional Liability", "Errors & Omissions"],
    attachments: 2,
    tags: ["SME", "New Business"],
  },
  {
    id: "QTE-20241211-0008",
    quoteNumber: "QTE-20241211-0008",
    title: "Commercial Property Portfolio - Retail Group SA",
    clientName: "Retail Group SA",
    clientId: "CLI-004",
    status: "ACCEPTED",
    riskType: "Property",
    coverageAmount: 45000000,
    premiumAmount: 780000,
    annualPremium: 780000,
    monthlyPremium: 65000,
    deductible: 150000,
    effectiveDate: "2025-01-01",
    expirationDate: "2025-12-31",
    quoteExpiryDate: "2024-12-18",
    createdDate: "2024-12-11",
    sentDate: "2024-12-11",
    acceptedDate: "2024-12-13",
    lastUpdated: "2024-12-13",
    createdBy: "Emily Davis",
    coverage: ["Property Damage", "Business Interruption", "Liability", "Theft"],
    attachments: 9,
    tags: ["Accepted", "Portfolio", "Premium Client"],
  },
  {
    id: "QTE-20241210-0042",
    quoteNumber: "QTE-20241210-0042",
    title: "General Liability - Manufacturing Co",
    clientName: "Manufacturing Co",
    clientId: "CLI-005",
    status: "REJECTED",
    riskType: "Liability",
    coverageAmount: 6500000,
    premiumAmount: 125000,
    annualPremium: 125000,
    monthlyPremium: 10417,
    deductible: 20000,
    effectiveDate: "2025-01-10",
    expirationDate: "2025-12-31",
    quoteExpiryDate: "2024-12-17",
    createdDate: "2024-12-10",
    sentDate: "2024-12-10",
    rejectedDate: "2024-12-12",
    rejectionReason: "Premium too high",
    lastUpdated: "2024-12-12",
    createdBy: "David Wilson",
    coverage: ["General Liability", "Product Liability"],
    attachments: 4,
    tags: ["Rejected", "High Risk"],
  },
  {
    id: "QTE-20241209-0033",
    quoteNumber: "QTE-20241209-0033",
    title: "Property Damage - Logistics Solutions",
    clientName: "Logistics Solutions",
    clientId: "CLI-006",
    status: "EXPIRED",
    riskType: "Property",
    coverageAmount: 18500000,
    premiumAmount: 310000,
    annualPremium: 310000,
    monthlyPremium: 25833,
    deductible: 75000,
    effectiveDate: "2025-01-05",
    expirationDate: "2025-12-31",
    quoteExpiryDate: "2024-12-14",
    createdDate: "2024-12-09",
    sentDate: "2024-12-09",
    lastUpdated: "2024-12-09",
    createdBy: "Lisa Anderson",
    coverage: ["Property Damage", "Cargo", "Liability"],
    attachments: 6,
    tags: ["Expired", "Standard"],
  },
  {
    id: "QTE-20241208-0025",
    quoteNumber: "QTE-20241208-0025",
    title: "Mining Operations Coverage - Mining Operations Ltd",
    clientName: "Mining Operations Ltd",
    clientId: "CLI-008",
    status: "SENT",
    riskType: "Property",
    coverageAmount: 95000000,
    premiumAmount: 2850000,
    annualPremium: 2850000,
    monthlyPremium: 237500,
    deductible: 500000,
    effectiveDate: "2025-02-15",
    expirationDate: "2025-12-31",
    quoteExpiryDate: "2024-12-22",
    createdDate: "2024-12-08",
    sentDate: "2024-12-14",
    lastUpdated: "2024-12-14",
    createdBy: "Jennifer Martinez",
    coverage: ["Property Damage", "Business Interruption", "Mining Liability", "Environmental"],
    attachments: 12,
    tags: ["Sent", "High Risk", "Mining"],
  },
  {
    id: "QTE-20241207-0018",
    quoteNumber: "QTE-20241207-0018",
    title: "Agricultural Property - Agricultural Holdings",
    clientName: "Agricultural Holdings",
    clientId: "CLI-009",
    status: "ACCEPTED",
    riskType: "Property",
    coverageAmount: 42000000,
    premiumAmount: 1150000,
    annualPremium: 1150000,
    monthlyPremium: 95833,
    deductible: 125000,
    effectiveDate: "2025-01-01",
    expirationDate: "2025-12-31",
    quoteExpiryDate: "2024-12-14",
    createdDate: "2024-12-07",
    sentDate: "2024-12-07",
    acceptedDate: "2024-12-10",
    lastUpdated: "2024-12-10",
    createdBy: "James White",
    coverage: ["Property Damage", "Crop Insurance", "Livestock", "Equipment"],
    attachments: 5,
    tags: ["Accepted", "Agriculture"],
  },
  {
    id: "QTE-20241206-0012",
    quoteNumber: "QTE-20241206-0012",
    title: "Hospitality Property - Hospitality Group",
    clientName: "Hospitality Group",
    clientId: "CLI-010",
    status: "DRAFT",
    riskType: "Property",
    coverageAmount: 25000000,
    premiumAmount: 680000,
    annualPremium: 680000,
    monthlyPremium: 56667,
    deductible: 85000,
    effectiveDate: "2025-01-15",
    expirationDate: "2025-12-31",
    quoteExpiryDate: "2024-12-13",
    createdDate: "2024-12-06",
    sentDate: null,
    lastUpdated: "2024-12-09",
    createdBy: "Patricia Lee",
    coverage: ["Property Damage", "Business Interruption", "Liability"],
    attachments: 3,
    tags: ["Draft", "High Risk"],
  },
  {
    id: "QTE-20241205-0009",
    quoteNumber: "QTE-20241205-0009",
    title: "Construction Liability - Construction Partners",
    clientName: "Construction Partners",
    clientId: "CLI-011",
    status: "SENT",
    riskType: "Liability",
    coverageAmount: 15000000,
    premiumAmount: 420000,
    annualPremium: 420000,
    monthlyPremium: 35000,
    deductible: 50000,
    effectiveDate: "2025-01-25",
    expirationDate: "2025-12-31",
    quoteExpiryDate: "2024-12-12",
    createdDate: "2024-12-05",
    sentDate: "2024-12-05",
    lastUpdated: "2024-12-05",
    createdBy: "Thomas Harris",
    coverage: ["General Liability", "Contractors Liability", "Workers Compensation"],
    attachments: 4,
    tags: ["SME", "High Risk", "Construction"],
  },
  {
    id: "QTE-20241204-0005",
    quoteNumber: "QTE-20241204-0005",
    title: "Energy Sector Coverage - Energy Solutions",
    clientName: "Energy Solutions",
    clientId: "CLI-012",
    status: "ACCEPTED",
    riskType: "Property",
    coverageAmount: 72000000,
    premiumAmount: 2100000,
    annualPremium: 2100000,
    monthlyPremium: 175000,
    deductible: 200000,
    effectiveDate: "2025-01-01",
    expirationDate: "2025-12-31",
    quoteExpiryDate: "2024-12-11",
    createdDate: "2024-12-04",
    sentDate: "2024-12-04",
    acceptedDate: "2024-12-08",
    lastUpdated: "2024-12-08",
    createdBy: "Maria Garcia",
    coverage: ["Property Damage", "Business Interruption", "Environmental", "Liability"],
    attachments: 8,
    tags: ["Accepted", "Premium Client", "Energy"],
  },
  {
    id: "QTE-20241203-0003",
    quoteNumber: "QTE-20241203-0003",
    title: "Business Interruption - ABC Corporation",
    clientName: "ABC Corporation",
    clientId: "CLI-001",
    status: "SENT",
    riskType: "Property",
    coverageAmount: 8500000,
    premiumAmount: 145000,
    annualPremium: 145000,
    monthlyPremium: 12083,
    deductible: 40000,
    effectiveDate: "2025-02-01",
    expirationDate: "2025-12-31",
    quoteExpiryDate: "2024-12-18",
    createdDate: "2024-12-03",
    sentDate: "2024-12-13",
    lastUpdated: "2024-12-13",
    createdBy: "John Smith",
    coverage: ["Business Interruption", "Loss of Revenue"],
    attachments: 3,
    tags: ["Amendment", "Sent"],
  },
  {
    id: "QTE-20241202-0002",
    quoteNumber: "QTE-20241202-0002",
    title: "Cyber Liability - Global Tech Ltd",
    clientName: "Global Tech Ltd",
    clientId: "CLI-003",
    status: "ACCEPTED",
    riskType: "Liability",
    coverageAmount: 18000000,
    premiumAmount: 320000,
    annualPremium: 320000,
    monthlyPremium: 26667,
    deductible: 60000,
    effectiveDate: "2025-01-10",
    expirationDate: "2025-12-31",
    quoteExpiryDate: "2024-12-09",
    createdDate: "2024-12-02",
    sentDate: "2024-12-02",
    acceptedDate: "2024-12-05",
    lastUpdated: "2024-12-05",
    createdBy: "Michael Brown",
    coverage: ["Cyber Liability", "Data Breach", "Network Security"],
    attachments: 6,
    tags: ["Accepted", "Cyber", "Technology"],
  },
  {
    id: "QTE-20241201-0001",
    quoteNumber: "QTE-20241201-0001",
    title: "Marine Cargo - Logistics Solutions",
    clientName: "Logistics Solutions",
    clientId: "CLI-006",
    status: "DRAFT",
    riskType: "Property",
    coverageAmount: 12000000,
    premiumAmount: 195000,
    annualPremium: 195000,
    monthlyPremium: 16250,
    deductible: 30000,
    effectiveDate: "2025-01-20",
    expirationDate: "2025-12-31",
    quoteExpiryDate: "2024-12-08",
    createdDate: "2024-12-01",
    sentDate: null,
    lastUpdated: "2024-12-01",
    createdBy: "Lisa Anderson",
    coverage: ["Marine Cargo", "Transit", "Storage"],
    attachments: 2,
    tags: ["Draft", "New Business", "Marine"],
  },
];

const STATUS_OPTIONS = ["All Statuses", "Draft", "Sent", "Accepted", "Rejected", "Expired"];
const RISK_TYPE_OPTIONS = ["All Types", "Property", "Liability"];

function getStatusBadge(status: string) {
  const config = {
    DRAFT: {
      label: "Draft",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400",
      icon: FileText,
    },
    SENT: {
      label: "Sent",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400",
      icon: Send,
    },
    ACCEPTED: {
      label: "Accepted",
      color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-400",
      icon: CheckCircle2,
    },
    REJECTED: {
      label: "Rejected",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400",
      icon: XCircle,
    },
    EXPIRED: {
      label: "Expired",
      color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-400",
      icon: Clock,
    },
  };
  const statusConfig = config[status as keyof typeof config] || config.DRAFT;
  const Icon = statusConfig.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusConfig.color}`}>
      <Icon className="h-3 w-3" />
      {statusConfig.label}
    </span>
  );
}

function isExpiringSoon(expiryDate: string): boolean {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
}

function isExpired(expiryDate: string): boolean {
  const expiry = new Date(expiryDate);
  const today = new Date();
  return expiry < today;
}

export default function QuotesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedRiskType, setSelectedRiskType] = useState("All Types");
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);

  const filteredQuotes = QUOTES.filter((quote) => {
    const matchesSearch =
      quote.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All Statuses" || quote.status === selectedStatus.toUpperCase();
    const matchesRiskType = selectedRiskType === "All Types" || quote.riskType === selectedRiskType;
    return matchesSearch && matchesStatus && matchesRiskType;
  });

  const selectedQuoteData = selectedQuote ? QUOTES.find((q) => q.id === selectedQuote) : null;

  const stats = {
    total: QUOTES.length,
    draft: QUOTES.filter((q) => q.status === "DRAFT").length,
    sent: QUOTES.filter((q) => q.status === "SENT").length,
    accepted: QUOTES.filter((q) => q.status === "ACCEPTED").length,
    rejected: QUOTES.filter((q) => q.status === "REJECTED").length,
    expired: QUOTES.filter((q) => q.status === "EXPIRED").length,
    totalPremium: QUOTES.reduce((sum, q) => sum + q.premiumAmount, 0),
    acceptedPremium: QUOTES.filter((q) => q.status === "ACCEPTED").reduce((sum, q) => sum + q.premiumAmount, 0),
    expiringSoon: QUOTES.filter((q) => isExpiringSoon(q.quoteExpiryDate)).length,
  };

  const statusCounts = {
    DRAFT: QUOTES.filter((q) => q.status === "DRAFT").length,
    SENT: QUOTES.filter((q) => q.status === "SENT").length,
    ACCEPTED: QUOTES.filter((q) => q.status === "ACCEPTED").length,
    REJECTED: QUOTES.filter((q) => q.status === "REJECTED").length,
    EXPIRED: QUOTES.filter((q) => q.status === "EXPIRED").length,
  };

  const riskTypeCounts = QUOTES.reduce((acc, quote) => {
    acc[quote.riskType] = (acc[quote.riskType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Total Quotes</div>
              <div className="mt-1 text-2xl font-semibold">{stats.total}</div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+4 this month</div>
            </div>
            <BadgeDollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Accepted</div>
              <div className="mt-1 text-2xl font-semibold">{stats.accepted}</div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                {Math.round((stats.accepted / stats.total) * 100)}% acceptance rate
              </div>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Sent</div>
              <div className="mt-1 text-2xl font-semibold">{stats.sent}</div>
              <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">Awaiting response</div>
            </div>
            <Send className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Draft</div>
              <div className="mt-1 text-2xl font-semibold">{stats.draft}</div>
              <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">In preparation</div>
            </div>
            <FileText className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Total Premium Value</div>
          <div className="mt-1 text-xl font-semibold">R {(stats.totalPremium / 1000000).toFixed(1)}M</div>
          <div className="mt-1 text-xs text-muted-foreground">All quotes</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Accepted Premium</div>
          <div className="mt-1 text-xl font-semibold">R {(stats.acceptedPremium / 1000000).toFixed(1)}M</div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">Confirmed business</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Rejected</div>
          <div className="mt-1 text-xl font-semibold">{stats.rejected}</div>
          <div className="mt-1 text-xs text-muted-foreground">Not accepted</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Expiring Soon</div>
          <div className="mt-1 text-xl font-semibold">{stats.expiringSoon}</div>
          <div className="mt-1 text-xs text-red-600 dark:text-red-400">Requires attention</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">Quotes</h3>
          <button className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <BadgeDollarSign className="h-4 w-4" />
            New Quote
          </button>
        </div>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search quotes by title, client, quote number, or creator..."
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
            <div className="ml-auto text-xs text-muted-foreground">
              Showing {filteredQuotes.length} of {QUOTES.length} quotes
            </div>
          </div>
        </div>
      </div>

      {/* Quotes List */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-4">
          <h3 className="text-base font-semibold">All Quotes</h3>
        </div>
        <div className="divide-y">
          {filteredQuotes.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No quotes found matching your search criteria.</div>
          ) : (
            filteredQuotes.map((quote) => {
              const isExpiring = isExpiringSoon(quote.quoteExpiryDate);
              const isExpiredStatus = isExpired(quote.quoteExpiryDate) && quote.status !== "EXPIRED";
              return (
                <div
                  key={quote.id}
                  className={`p-4 transition-colors hover:bg-muted/50 ${
                    selectedQuote === quote.id ? "bg-primary/5" : ""
                  } ${isExpiring ? "border-l-4 border-l-amber-500" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-1 items-start gap-4">
                      <div className="rounded-lg border bg-muted p-3">
                        <BadgeDollarSign className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-semibold">{quote.title}</h4>
                          {getStatusBadge(quote.status)}
                          {isExpiring && quote.status !== "EXPIRED" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-400">
                              <AlertCircle className="h-3 w-3" />
                              Expiring Soon
                            </span>
                          )}
                          {isExpiredStatus && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-400">
                              <XCircle className="h-3 w-3" />
                              Expired
                            </span>
                          )}
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {quote.riskType}
                          </span>
                        </div>
                        <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-3 w-3" />
                            <span>{quote.clientName}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3 w-3" />
                            <span>Quote: {quote.quoteNumber}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <User className="h-3 w-3" />
                            <span>Created by: {quote.createdBy}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(quote.createdDate)}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Shield className="h-3 w-3" />
                            <span>Coverage: R {quote.coverageAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="h-3 w-3" />
                            <span>Premium: R {quote.premiumAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            <span>Expires: {formatDate(quote.quoteExpiryDate)}</span>
                          </div>
                          {quote.sentDate && (
                            <div className="flex items-center gap-1.5">
                              <Send className="h-3 w-3" />
                              <span>Sent: {formatDate(quote.sentDate)}</span>
                            </div>
                          )}
                          {quote.acceptedDate && (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Accepted: {formatDate(quote.acceptedDate)}</span>
                            </div>
                          )}
                          {quote.rejectedDate && (
                            <div className="flex items-center gap-1.5">
                              <XCircle className="h-3 w-3" />
                              <span>Rejected: {formatDate(quote.rejectedDate)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {quote.tags.map((tag, idx) => (
                            <span key={idx} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedQuote(selectedQuote === quote.id ? null : quote.id)}
                        className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {quote.status === "DRAFT" && (
                        <button
                          className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          title="Edit Quote"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {quote.status === "SENT" && (
                        <button
                          className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          title="Send Reminder"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        title="Download Quote"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        title="Copy Quote"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedQuote === quote.id && (
                    <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                      <h5 className="mb-3 text-sm font-semibold">Quote Details</h5>
                      <div className="grid gap-4 text-sm md:grid-cols-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Quote Number</div>
                          <div className="mt-1 font-medium">{quote.quoteNumber}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Status</div>
                          <div className="mt-1">{getStatusBadge(quote.status)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Client</div>
                          <div className="mt-1 font-medium">{quote.clientName}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Client ID</div>
                          <div className="mt-1 font-medium">{quote.clientId}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Risk Type</div>
                          <div className="mt-1 font-medium">{quote.riskType}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Coverage Amount</div>
                          <div className="mt-1 font-medium">R {quote.coverageAmount.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Annual Premium</div>
                          <div className="mt-1 font-medium">R {quote.annualPremium.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Monthly Premium</div>
                          <div className="mt-1 font-medium">R {quote.monthlyPremium.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Deductible</div>
                          <div className="mt-1 font-medium">R {quote.deductible.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Effective Date</div>
                          <div className="mt-1 font-medium">{formatDate(quote.effectiveDate)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Expiration Date</div>
                          <div className="mt-1 font-medium">{formatDate(quote.expirationDate)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Quote Expiry Date</div>
                          <div className="mt-1 font-medium">{formatDate(quote.quoteExpiryDate)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Created By</div>
                          <div className="mt-1 font-medium">{quote.createdBy}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Created Date</div>
                          <div className="mt-1 font-medium">{formatDate(quote.createdDate)}</div>
                        </div>
                        {quote.sentDate && (
                          <div>
                            <div className="text-xs text-muted-foreground">Sent Date</div>
                            <div className="mt-1 font-medium">{formatDate(quote.sentDate)}</div>
                          </div>
                        )}
                        {quote.acceptedDate && (
                          <div>
                            <div className="text-xs text-muted-foreground">Accepted Date</div>
                            <div className="mt-1 font-medium">{formatDate(quote.acceptedDate)}</div>
                          </div>
                        )}
                        {quote.rejectedDate && (
                          <div>
                            <div className="text-xs text-muted-foreground">Rejected Date</div>
                            <div className="mt-1 font-medium">{formatDate(quote.rejectedDate)}</div>
                          </div>
                        )}
                        {quote.rejectionReason && (
                          <div className="md:col-span-2">
                            <div className="text-xs text-muted-foreground">Rejection Reason</div>
                            <div className="mt-1 font-medium">{quote.rejectionReason}</div>
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <div className="text-xs text-muted-foreground">Coverage</div>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {quote.coverage.map((cov, idx) => (
                              <span key={idx} className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                {cov}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Attachments</div>
                          <div className="mt-1 font-medium">{quote.attachments}</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-xs text-muted-foreground mb-2">Tags</div>
                        <div className="flex flex-wrap gap-2">
                          {quote.tags.map((tag, idx) => (
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
              );
            })
          )}
        </div>
      </div>

      {/* Statistics Panels */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold">Quotes by Status</h3>
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = (count / QUOTES.length) * 100;
              return (
                <div key={status} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{status}</span>
                    <span className="text-muted-foreground">{count} quotes</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${
                        status === "ACCEPTED"
                          ? "bg-emerald-500"
                          : status === "SENT"
                          ? "bg-blue-500"
                          : status === "DRAFT"
                          ? "bg-gray-500"
                          : status === "REJECTED"
                          ? "bg-red-500"
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
          <h3 className="mb-4 text-base font-semibold">Quotes by Risk Type</h3>
          <div className="space-y-3">
            {Object.entries(riskTypeCounts).map(([type, count]) => {
              const percentage = (count / QUOTES.length) * 100;
              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{type}</span>
                    <span className="text-muted-foreground">{count} quotes</span>
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

