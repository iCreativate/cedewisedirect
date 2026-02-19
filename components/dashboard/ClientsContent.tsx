"use client";
import { useState } from "react";
import {
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  X,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  Shield,
  Activity,
} from "lucide-react";
import { formatDate } from "@/lib/dateUtils";

const CLIENTS = [
  {
    id: "CLI-001",
    name: "ABC Corporation",
    type: "Corporate",
    industry: "Manufacturing",
    contactPerson: "John Smith",
    email: "john.smith@abccorp.com",
    phone: "+27 11 234 5678",
    address: "123 Industrial Road, Johannesburg, Gauteng",
    status: "active",
    totalPolicies: 3,
    activePolicies: 2,
    totalCoverage: 45000000,
    totalPremium: 1250000,
    riskRating: "Low",
    lastActivity: "2024-12-15",
    joinDate: "2023-01-15",
    renewalDate: "2025-01-15",
    tags: ["Premium Client", "Renewal"],
  },
  {
    id: "CLI-002",
    name: "XYZ Industries",
    type: "Corporate",
    industry: "Technology",
    contactPerson: "Sarah Johnson",
    email: "sarah.j@xyzind.com",
    phone: "+27 21 345 6789",
    address: "456 Tech Park, Cape Town, Western Cape",
    status: "active",
    totalPolicies: 2,
    activePolicies: 2,
    totalCoverage: 28000000,
    totalPremium: 780000,
    riskRating: "Medium",
    lastActivity: "2024-12-14",
    joinDate: "2023-03-20",
    renewalDate: "2025-03-20",
    tags: ["Standard"],
  },
  {
    id: "CLI-003",
    name: "Global Tech Ltd",
    type: "Corporate",
    industry: "Technology",
    contactPerson: "Michael Brown",
    email: "m.brown@globaltech.com",
    phone: "+27 31 456 7890",
    address: "789 Innovation Drive, Durban, KwaZulu-Natal",
    status: "active",
    totalPolicies: 4,
    activePolicies: 3,
    totalCoverage: 65000000,
    totalPremium: 1950000,
    riskRating: "Low",
    lastActivity: "2024-12-13",
    joinDate: "2022-06-10",
    renewalDate: "2025-06-10",
    tags: ["Premium Client", "Long-term"],
  },
  {
    id: "CLI-004",
    name: "Retail Group SA",
    type: "Corporate",
    industry: "Retail",
    contactPerson: "Emily Davis",
    email: "emily.davis@retailgroup.co.za",
    phone: "+27 11 567 8901",
    address: "321 Commerce Street, Pretoria, Gauteng",
    status: "active",
    totalPolicies: 5,
    activePolicies: 4,
    totalCoverage: 85000000,
    totalPremium: 2450000,
    riskRating: "Medium",
    lastActivity: "2024-12-12",
    joinDate: "2021-09-15",
    renewalDate: "2025-09-15",
    tags: ["Premium Client", "Multi-site"],
  },
  {
    id: "CLI-005",
    name: "Manufacturing Co",
    type: "Corporate",
    industry: "Manufacturing",
    contactPerson: "David Wilson",
    email: "d.wilson@manufacturing.co.za",
    phone: "+27 41 678 9012",
    address: "654 Factory Lane, Port Elizabeth, Eastern Cape",
    status: "pending",
    totalPolicies: 1,
    activePolicies: 0,
    totalCoverage: 12000000,
    totalPremium: 320000,
    riskRating: "High",
    lastActivity: "2024-12-10",
    joinDate: "2024-11-05",
    renewalDate: "2025-11-05",
    tags: ["New Client"],
  },
  {
    id: "CLI-006",
    name: "Logistics Solutions",
    type: "Corporate",
    industry: "Logistics",
    contactPerson: "Lisa Anderson",
    email: "lisa@logisticsolutions.co.za",
    phone: "+27 12 789 0123",
    address: "987 Transport Way, Bloemfontein, Free State",
    status: "active",
    totalPolicies: 2,
    activePolicies: 2,
    totalCoverage: 35000000,
    totalPremium: 980000,
    riskRating: "Medium",
    lastActivity: "2024-12-09",
    joinDate: "2023-07-22",
    renewalDate: "2025-07-22",
    tags: ["Standard"],
  },
  {
    id: "CLI-007",
    name: "TechStart Inc",
    type: "SME",
    industry: "Technology",
    contactPerson: "Robert Taylor",
    email: "robert@techstart.co.za",
    phone: "+27 11 890 1234",
    address: "147 Startup Hub, Johannesburg, Gauteng",
    status: "active",
    totalPolicies: 1,
    activePolicies: 1,
    totalCoverage: 8500000,
    totalPremium: 245000,
    riskRating: "Low",
    lastActivity: "2024-12-08",
    joinDate: "2024-02-14",
    renewalDate: "2025-02-14",
    tags: ["SME"],
  },
  {
    id: "CLI-008",
    name: "Mining Operations Ltd",
    type: "Corporate",
    industry: "Mining",
    contactPerson: "Jennifer Martinez",
    email: "j.martinez@miningops.co.za",
    phone: "+27 18 901 2345",
    address: "258 Mine Road, Rustenburg, North West",
    status: "active",
    totalPolicies: 3,
    activePolicies: 3,
    totalCoverage: 95000000,
    totalPremium: 2850000,
    riskRating: "High",
    lastActivity: "2024-12-07",
    joinDate: "2020-04-08",
    renewalDate: "2025-04-08",
    tags: ["Premium Client", "High Risk"],
  },
  {
    id: "CLI-009",
    name: "Agricultural Holdings",
    type: "Corporate",
    industry: "Agriculture",
    contactPerson: "James White",
    email: "j.white@agriholdings.co.za",
    phone: "+27 51 012 3456",
    address: "369 Farm Road, Nelspruit, Mpumalanga",
    status: "active",
    totalPolicies: 2,
    activePolicies: 2,
    totalCoverage: 42000000,
    totalPremium: 1150000,
    riskRating: "Medium",
    lastActivity: "2024-12-06",
    joinDate: "2022-11-30",
    renewalDate: "2025-11-30",
    tags: ["Standard"],
  },
  {
    id: "CLI-010",
    name: "Hospitality Group",
    type: "Corporate",
    industry: "Hospitality",
    contactPerson: "Patricia Lee",
    email: "p.lee@hospitality.co.za",
    phone: "+27 21 123 4567",
    address: "741 Hotel Boulevard, Cape Town, Western Cape",
    status: "inactive",
    totalPolicies: 2,
    activePolicies: 0,
    totalCoverage: 25000000,
    totalPremium: 680000,
    riskRating: "Medium",
    lastActivity: "2024-10-15",
    joinDate: "2023-05-12",
    renewalDate: "2025-05-12",
    tags: ["Inactive"],
  },
  {
    id: "CLI-011",
    name: "Construction Partners",
    type: "SME",
    industry: "Construction",
    contactPerson: "Thomas Harris",
    email: "t.harris@constpartners.co.za",
    phone: "+27 11 234 5678",
    address: "852 Builders Way, Johannesburg, Gauteng",
    status: "active",
    totalPolicies: 1,
    activePolicies: 1,
    totalCoverage: 15000000,
    totalPremium: 420000,
    riskRating: "High",
    lastActivity: "2024-12-05",
    joinDate: "2024-08-20",
    renewalDate: "2025-08-20",
    tags: ["SME", "High Risk"],
  },
  {
    id: "CLI-012",
    name: "Energy Solutions",
    type: "Corporate",
    industry: "Energy",
    contactPerson: "Maria Garcia",
    email: "m.garcia@energysolutions.co.za",
    phone: "+27 31 345 6789",
    address: "963 Power Street, Durban, KwaZulu-Natal",
    status: "active",
    totalPolicies: 3,
    activePolicies: 3,
    totalCoverage: 72000000,
    totalPremium: 2100000,
    riskRating: "Medium",
    lastActivity: "2024-12-04",
    joinDate: "2021-12-05",
    renewalDate: "2025-12-05",
    tags: ["Premium Client"],
  },
];

const STATUS_OPTIONS = ["All Statuses", "Active", "Pending", "Inactive"];
const TYPE_OPTIONS = ["All Types", "Corporate", "SME"];
const INDUSTRY_OPTIONS = [
  "All Industries",
  "Manufacturing",
  "Technology",
  "Retail",
  "Logistics",
  "Mining",
  "Agriculture",
  "Hospitality",
  "Construction",
  "Energy",
];

function getStatusBadge(status: string) {
  const config = {
    active: { label: "Active", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-400", icon: CheckCircle2 },
    pending: { label: "Pending", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-400", icon: Clock },
    inactive: { label: "Inactive", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400", icon: AlertCircle },
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

function getRiskRatingBadge(rating: string) {
  const config = {
    Low: { color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-400" },
    Medium: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-400" },
    High: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400" },
  };
  const ratingConfig = config[rating as keyof typeof config] || config.Medium;
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${ratingConfig.color}`}>
      {rating}
    </span>
  );
}

export default function ClientsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const filteredClients = CLIENTS.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All Statuses" || client.status === selectedStatus.toLowerCase();
    const matchesType = selectedType === "All Types" || client.type === selectedType;
    const matchesIndustry = selectedIndustry === "All Industries" || client.industry === selectedIndustry;
    return matchesSearch && matchesStatus && matchesType && matchesIndustry;
  });

  const selectedClientData = selectedClient ? CLIENTS.find((c) => c.id === selectedClient) : null;

  const stats = {
    total: CLIENTS.length,
    active: CLIENTS.filter((c) => c.status === "active").length,
    pending: CLIENTS.filter((c) => c.status === "pending").length,
    inactive: CLIENTS.filter((c) => c.status === "inactive").length,
    totalCoverage: CLIENTS.reduce((sum, c) => sum + c.totalCoverage, 0),
    totalPremium: CLIENTS.reduce((sum, c) => sum + c.totalPremium, 0),
    totalPolicies: CLIENTS.reduce((sum, c) => sum + c.totalPolicies, 0),
    activePolicies: CLIENTS.reduce((sum, c) => sum + c.activePolicies, 0),
  };

  const statusCounts = {
    active: CLIENTS.filter((c) => c.status === "active").length,
    pending: CLIENTS.filter((c) => c.status === "pending").length,
    inactive: CLIENTS.filter((c) => c.status === "inactive").length,
  };

  const industryCounts = CLIENTS.reduce((acc, client) => {
    acc[client.industry] = (acc[client.industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Total Clients</div>
              <div className="mt-1 text-2xl font-semibold">{stats.total}</div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+3 this month</div>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Active Clients</div>
              <div className="mt-1 text-2xl font-semibold">{stats.active}</div>
              <div className="mt-1 text-xs text-muted-foreground">{Math.round((stats.active / stats.total) * 100)}% of total</div>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Total Coverage</div>
              <div className="mt-1 text-2xl font-semibold">R {(stats.totalCoverage / 1000000).toFixed(1)}M</div>
              <div className="mt-1 text-xs text-muted-foreground">Across all clients</div>
            </div>
            <Shield className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Total Premium</div>
              <div className="mt-1 text-2xl font-semibold">R {(stats.totalPremium / 1000000).toFixed(1)}M</div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+12% this year</div>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Total Policies</div>
          <div className="mt-1 text-xl font-semibold">{stats.totalPolicies}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Active Policies</div>
          <div className="mt-1 text-xl font-semibold">{stats.activePolicies}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Pending Clients</div>
          <div className="mt-1 text-xl font-semibold">{stats.pending}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Inactive Clients</div>
          <div className="mt-1 text-xl font-semibold">{stats.inactive}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">Clients</h3>
          <button className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Users className="h-4 w-4" />
            Add New Client
          </button>
        </div>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients by name, contact person, email, or industry..."
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
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {INDUSTRY_OPTIONS.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            <div className="ml-auto text-xs text-muted-foreground">
              Showing {filteredClients.length} of {CLIENTS.length} clients
            </div>
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-4">
          <h3 className="text-base font-semibold">All Clients</h3>
        </div>
        <div className="divide-y">
          {filteredClients.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No clients found matching your search criteria.</div>
          ) : (
            filteredClients.map((client) => (
              <div
                key={client.id}
                className={`p-4 transition-colors hover:bg-muted/50 ${
                  selectedClient === client.id ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-start gap-4">
                    <div className="rounded-lg border bg-muted p-3">
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-sm font-semibold">{client.name}</h4>
                        {getStatusBadge(client.status)}
                        {getRiskRatingBadge(client.riskRating)}
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {client.type}
                        </span>
                      </div>
                      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3 w-3" />
                          <span>{client.contactPerson}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3" />
                          <span>{client.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{client.address.split(",")[0]}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3 w-3" />
                          <span>
                            {client.activePolicies}/{client.totalPolicies} Policies
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Shield className="h-3 w-3" />
                          <span>Coverage: R {(client.totalCoverage / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-3 w-3" />
                          <span>Premium: R {client.totalPremium.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          <span>Renewal: {formatDate(client.renewalDate)}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">{client.industry}</span>
                        {client.tags.map((tag, idx) => (
                          <span key={idx} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
                      className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      title="Edit Client"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedClient === client.id && (
                  <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                    <h5 className="mb-3 text-sm font-semibold">Client Details</h5>
                    <div className="grid gap-4 text-sm md:grid-cols-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Client ID</div>
                        <div className="mt-1 font-medium">{client.id}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Industry</div>
                        <div className="mt-1 font-medium">{client.industry}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Contact Person</div>
                        <div className="mt-1 font-medium">{client.contactPerson}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Email</div>
                        <div className="mt-1 font-medium">{client.email}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Phone</div>
                        <div className="mt-1 font-medium">{client.phone}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Address</div>
                        <div className="mt-1 font-medium">{client.address}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Join Date</div>
                        <div className="mt-1 font-medium">{formatDate(client.joinDate)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Last Activity</div>
                        <div className="mt-1 font-medium">{formatDate(client.lastActivity)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Total Policies</div>
                        <div className="mt-1 font-medium">{client.totalPolicies}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Active Policies</div>
                        <div className="mt-1 font-medium">{client.activePolicies}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Total Coverage</div>
                        <div className="mt-1 font-medium">R {client.totalCoverage.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Total Premium</div>
                        <div className="mt-1 font-medium">R {client.totalPremium.toLocaleString()}</div>
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
          <h3 className="mb-4 text-base font-semibold">Clients by Status</h3>
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = (count / CLIENTS.length) * 100;
              return (
                  <div key={status} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{status}</span>
                    <span className="text-muted-foreground">{count} clients</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${
                        status === "active"
                          ? "bg-emerald-500"
                          : status === "pending"
                          ? "bg-amber-500"
                          : "bg-gray-500"
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
          <h3 className="mb-4 text-base font-semibold">Clients by Industry</h3>
          <div className="space-y-3">
            {Object.entries(industryCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([industry, count]) => {
                const percentage = (count / CLIENTS.length) * 100;
                return (
                  <div key={industry} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{industry}</span>
                      <span className="text-muted-foreground">{count} clients</span>
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

