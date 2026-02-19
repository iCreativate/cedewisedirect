"use client";
import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  Upload,
  FileCheck,
  FileX,
  FileSearch,
  Folder,
  Calendar,
  User,
  Search,
  Filter,
  X,
} from "lucide-react";
import { formatDate } from "@/lib/dateUtils";

const DOCUMENTS = [
  {
    id: "DOC-001",
    name: "Policy Document - ABC Corporation",
    type: "Policy",
    category: "Policy Documents",
    client: "ABC Corporation",
    policyNo: "POL-20241215-0001",
    uploadDate: "2024-12-15",
    size: "2.4 MB",
    format: "PDF",
    status: "approved",
    uploadedBy: "John Smith",
    tags: ["Active", "Renewal"],
  },
  {
    id: "DOC-002",
    name: "Claim Form - XYZ Industries",
    type: "Claim",
    category: "Claims",
    client: "XYZ Industries",
    policyNo: "POL-20241214-0032",
    uploadDate: "2024-12-14",
    size: "856 KB",
    format: "PDF",
    status: "pending",
    uploadedBy: "Sarah Johnson",
    tags: ["Under Review"],
  },
  {
    id: "DOC-003",
    name: "Certificate of Insurance - Global Tech Ltd",
    type: "Certificate",
    category: "Certificates",
    client: "Global Tech Ltd",
    policyNo: "POL-20241213-0021",
    uploadDate: "2024-12-13",
    size: "1.2 MB",
    format: "PDF",
    status: "approved",
    uploadedBy: "Michael Brown",
    tags: ["Active"],
  },
  {
    id: "DOC-004",
    name: "Renewal Notice - Retail Group SA",
    type: "Renewal",
    category: "Renewals",
    client: "Retail Group SA",
    policyNo: "POL-20241211-0008",
    uploadDate: "2024-12-11",
    size: "945 KB",
    format: "PDF",
    status: "approved",
    uploadedBy: "Emily Davis",
    tags: ["Renewal", "Due Soon"],
  },
  {
    id: "DOC-005",
    name: "Survey Report - Manufacturing Co",
    type: "Survey",
    category: "Survey Reports",
    client: "Manufacturing Co",
    policyNo: "POL-20241210-0042",
    uploadDate: "2024-12-10",
    size: "3.8 MB",
    format: "PDF",
    status: "approved",
    uploadedBy: "David Wilson",
    tags: ["Risk Assessment"],
  },
  {
    id: "DOC-006",
    name: "Endorsement Request - Logistics Solutions",
    type: "Endorsement",
    category: "Endorsements",
    client: "Logistics Solutions",
    policyNo: "POL-20241209-0033",
    uploadDate: "2024-12-09",
    size: "1.5 MB",
    format: "PDF",
    status: "pending",
    uploadedBy: "Lisa Anderson",
    tags: ["Amendment"],
  },
  {
    id: "DOC-007",
    name: "Loss Assessment Report - TechStart Inc",
    type: "Loss Report",
    category: "Claims",
    client: "TechStart Inc",
    policyNo: "POL-20241208-0025",
    uploadDate: "2024-12-08",
    size: "4.2 MB",
    format: "PDF",
    status: "approved",
    uploadedBy: "Robert Taylor",
    tags: ["Loss", "Assessment"],
  },
  {
    id: "DOC-008",
    name: "Premium Invoice - Mining Operations",
    type: "Invoice",
    category: "Invoices",
    client: "Mining Operations Ltd",
    policyNo: "POL-20241207-0018",
    uploadDate: "2024-12-07",
    size: "678 KB",
    format: "PDF",
    status: "approved",
    uploadedBy: "Jennifer Martinez",
    tags: ["Billing"],
  },
  {
    id: "DOC-009",
    name: "Underwriting Guidelines 2024",
    type: "Guideline",
    category: "Internal Documents",
    client: "Internal",
    policyNo: "N/A",
    uploadDate: "2024-12-05",
    size: "2.1 MB",
    format: "PDF",
    status: "approved",
    uploadedBy: "Admin",
    tags: ["Internal", "Reference"],
  },
  {
    id: "DOC-010",
    name: "Client Agreement - ABC Corporation",
    type: "Agreement",
    category: "Agreements",
    client: "ABC Corporation",
    policyNo: "POL-20241215-0001",
    uploadDate: "2024-12-04",
    size: "1.8 MB",
    format: "PDF",
    status: "approved",
    uploadedBy: "John Smith",
    tags: ["Contract"],
  },
  {
    id: "DOC-011",
    name: "Renewal Terms - XYZ Industries",
    type: "Renewal",
    category: "Renewals",
    client: "XYZ Industries",
    policyNo: "POL-20241214-0032",
    uploadDate: "2024-12-03",
    size: "1.3 MB",
    format: "PDF",
    status: "pending",
    uploadedBy: "Sarah Johnson",
    tags: ["Renewal", "Terms"],
  },
  {
    id: "DOC-012",
    name: "Risk Assessment Summary - Global Tech Ltd",
    type: "Assessment",
    category: "Risk Assessments",
    client: "Global Tech Ltd",
    policyNo: "POL-20241213-0021",
    uploadDate: "2024-12-02",
    size: "2.9 MB",
    format: "PDF",
    status: "approved",
    uploadedBy: "Michael Brown",
    tags: ["Risk", "Summary"],
  },
];

const CATEGORIES = [
  "All Categories",
  "Policy Documents",
  "Claims",
  "Certificates",
  "Renewals",
  "Endorsements",
  "Invoices",
  "Survey Reports",
  "Risk Assessments",
  "Agreements",
  "Internal Documents",
];

const DOCUMENT_TYPES = [
  "All Types",
  "Policy",
  "Claim",
  "Certificate",
  "Renewal",
  "Endorsement",
  "Survey",
  "Loss Report",
  "Invoice",
  "Guideline",
  "Agreement",
  "Assessment",
];

function getStatusBadge(status: string) {
  const config = {
    approved: { label: "Approved", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-400", icon: FileCheck },
    pending: { label: "Pending", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-400", icon: FileX },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400", icon: FileX },
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

export default function DocumentsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const filteredDocuments = DOCUMENTS.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.policyNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || doc.category === selectedCategory;
    const matchesType = selectedType === "All Types" || doc.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const selectedDocumentData = selectedDocument
    ? DOCUMENTS.find((d) => d.id === selectedDocument)
    : null;

  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    if (cat === "All Categories") {
      acc[cat] = DOCUMENTS.length;
    } else {
      acc[cat] = DOCUMENTS.filter((d) => d.category === cat).length;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalSize = DOCUMENTS.reduce((sum, doc) => {
    const size = parseFloat(doc.size.replace(" MB", "").replace(" KB", ""));
    const unit = doc.size.includes("MB") ? "MB" : "KB";
    return sum + (unit === "MB" ? size : size / 1000);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Total Documents</div>
          <div className="mt-1 text-2xl font-semibold">{DOCUMENTS.length}</div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+5 this month</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Total Storage</div>
          <div className="mt-1 text-2xl font-semibold">{totalSize.toFixed(1)} MB</div>
          <div className="mt-1 text-xs text-muted-foreground">Across all documents</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Pending Approval</div>
          <div className="mt-1 text-2xl font-semibold">{DOCUMENTS.filter((d) => d.status === "pending").length}</div>
          <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">Requires review</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Approved</div>
          <div className="mt-1 text-2xl font-semibold">{DOCUMENTS.filter((d) => d.status === "approved").length}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {Math.round((DOCUMENTS.filter((d) => d.status === "approved").length / DOCUMENTS.length) * 100)}% of total
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">Documents</h3>
          <button className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Upload className="h-4 w-4" />
            Upload Document
          </button>
        </div>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents by name, client, or policy number..."
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
          {/* Category and Type Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} {cat !== "All Categories" && `(${categoryCounts[cat]})`}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="ml-auto text-xs text-muted-foreground">
              Showing {filteredDocuments.length} of {DOCUMENTS.length} documents
            </div>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-4">
          <h3 className="text-base font-semibold">All Documents</h3>
        </div>
        <div className="divide-y">
          {filteredDocuments.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No documents found matching your search criteria.
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 transition-colors hover:bg-muted/50 ${
                  selectedDocument === doc.id ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-start gap-4">
                    <div className="rounded-lg border bg-muted p-3">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-sm font-semibold">{doc.name}</h4>
                        {getStatusBadge(doc.status)}
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {doc.format}
                        </span>
                      </div>
                      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-1.5">
                          <Folder className="h-3 w-3" />
                          <span>{doc.category}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3" />
                          <span>{doc.client}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3 w-3" />
                          <span>Policy: {doc.policyNo}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(doc.uploadDate)}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground">Uploaded by: {doc.uploadedBy}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">Size: {doc.size}</span>
                        {doc.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDocument(selectedDocument === doc.id ? null : doc.id)}
                      className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedDocument === doc.id && (
                  <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                    <h5 className="mb-3 text-sm font-semibold">Document Details</h5>
                    <div className="grid gap-4 text-sm md:grid-cols-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Document ID</div>
                        <div className="mt-1 font-medium">{doc.id}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Document Type</div>
                        <div className="mt-1 font-medium">{doc.type}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Category</div>
                        <div className="mt-1 font-medium">{doc.category}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">File Size</div>
                        <div className="mt-1 font-medium">{doc.size}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Format</div>
                        <div className="mt-1 font-medium">{doc.format}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Upload Date</div>
                        <div className="mt-1 font-medium">{formatDate(doc.uploadDate)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Uploaded By</div>
                        <div className="mt-1 font-medium">{doc.uploadedBy}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Status</div>
                        <div className="mt-1">{getStatusBadge(doc.status)}</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-xs text-muted-foreground mb-2">Tags</div>
                      <div className="flex flex-wrap gap-2">
                        {doc.tags.map((tag, idx) => (
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

      {/* Category Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold">Documents by Category</h3>
          <div className="space-y-3">
            {CATEGORIES.filter((cat) => cat !== "All Categories")
              .sort((a, b) => categoryCounts[b] - categoryCounts[a])
              .map((category) => {
                const count = categoryCounts[category];
                const percentage = (count / DOCUMENTS.length) * 100;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{category}</span>
                      <span className="text-muted-foreground">{count} documents</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold">Recent Uploads</h3>
          <div className="space-y-3">
            {DOCUMENTS.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
              .slice(0, 5)
              .map((doc) => (
                <div key={doc.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="rounded border bg-muted p-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {doc.client} • {formatDate(doc.uploadDate)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{doc.size}</div>
                    {getStatusBadge(doc.status)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

