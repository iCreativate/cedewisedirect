"use client";
import { useState } from "react";
import { FileText, Download, Eye, Edit, Trash2, Calendar, User, MapPin, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { formatDate } from "@/lib/dateUtils";

const SURVEY_REPORTS = [
  {
    id: "SR-2024-001",
    title: "Property Risk Assessment - ABC Corporation",
    client: "ABC Corporation",
    location: "Johannesburg, Gauteng",
    surveyDate: "2024-12-10",
    reportDate: "2024-12-15",
    status: "approved",
    surveyType: "Property Risk Assessment",
    riskRating: "Medium",
    surveyor: "John Smith",
    findings: "Standard property risks identified. Minor improvements recommended.",
    premiumImpact: "+R 45,000",
    attachments: 3,
  },
  {
    id: "SR-2024-002",
    title: "Liability Survey - XYZ Industries",
    client: "XYZ Industries",
    location: "Cape Town, Western Cape",
    surveyDate: "2024-12-08",
    reportDate: "2024-12-12",
    status: "reviewed",
    surveyType: "Liability Assessment",
    riskRating: "High",
    surveyor: "Sarah Johnson",
    findings: "Several high-risk areas identified requiring immediate attention.",
    premiumImpact: "+R 120,000",
    attachments: 5,
  },
  {
    id: "SR-2024-003",
    title: "Business Interruption Analysis - Global Tech Ltd",
    client: "Global Tech Ltd",
    location: "Durban, KwaZulu-Natal",
    surveyDate: "2024-12-05",
    reportDate: "2024-12-10",
    status: "approved",
    surveyType: "Business Interruption",
    riskRating: "Low",
    surveyor: "Michael Brown",
    findings: "Robust business continuity plans in place. Low risk profile.",
    premiumImpact: "-R 15,000",
    attachments: 2,
  },
  {
    id: "SR-2024-004",
    title: "Property & Fire Safety Survey - Retail Group SA",
    client: "Retail Group SA",
    location: "Pretoria, Gauteng",
    surveyDate: "2024-12-03",
    reportDate: "2024-12-08",
    status: "submitted",
    surveyType: "Fire Safety Assessment",
    riskRating: "Medium-High",
    surveyor: "Emily Davis",
    findings: "Fire safety systems adequate but maintenance schedule needs improvement.",
    premiumImpact: "+R 78,000",
    attachments: 4,
  },
  {
    id: "SR-2024-005",
    title: "Security & Risk Assessment - Manufacturing Co",
    client: "Manufacturing Co",
    location: "Port Elizabeth, Eastern Cape",
    surveyDate: "2024-11-28",
    reportDate: "2024-12-05",
    status: "draft",
    surveyType: "Security Assessment",
    riskRating: "Medium",
    surveyor: "David Wilson",
    findings: "Survey in progress. Preliminary findings indicate moderate risk levels.",
    premiumImpact: "Pending",
    attachments: 1,
  },
  {
    id: "SR-2024-006",
    title: "Environmental Risk Survey - TechStart Inc",
    client: "TechStart Inc",
    location: "Sandton, Gauteng",
    surveyDate: "2024-11-25",
    reportDate: "2024-11-30",
    status: "approved",
    surveyType: "Environmental Risk",
    riskRating: "Low",
    surveyor: "Lisa Anderson",
    findings: "Excellent environmental controls. No significant risks identified.",
    premiumImpact: "-R 8,000",
    attachments: 3,
  },
  {
    id: "SR-2024-007",
    title: "Comprehensive Risk Survey - Logistics Solutions",
    client: "Logistics Solutions",
    location: "Bloemfontein, Free State",
    surveyDate: "2024-11-20",
    reportDate: "2024-11-28",
    status: "reviewed",
    surveyType: "Comprehensive Risk",
    riskRating: "High",
    surveyor: "Robert Taylor",
    findings: "Multiple risk factors identified. Comprehensive risk mitigation plan required.",
    premiumImpact: "+R 95,000",
    attachments: 6,
  },
  {
    id: "SR-2024-008",
    title: "Occupational Health & Safety Survey - Mining Operations",
    client: "Mining Operations Ltd",
    location: "Mpumalanga",
    surveyDate: "2024-11-15",
    reportDate: "2024-11-25",
    status: "approved",
    surveyType: "OH&S Assessment",
    riskRating: "High",
    surveyor: "Jennifer Martinez",
    findings: "Strict compliance with OH&S regulations. Enhanced safety protocols recommended.",
    premiumImpact: "+R 150,000",
    attachments: 8,
  },
];

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200", icon: Clock },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: FileText },
  reviewed: { label: "Under Review", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", icon: Eye },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: XCircle },
};

const RISK_RATING_COLORS = {
  Low: "text-emerald-600 dark:text-emerald-400",
  Medium: "text-yellow-600 dark:text-yellow-400",
  "Medium-High": "text-orange-600 dark:text-orange-400",
  High: "text-red-600 dark:text-red-400",
};

export default function SurveyReportContent() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const filteredReports = filterStatus === "all" 
    ? SURVEY_REPORTS 
    : SURVEY_REPORTS.filter(report => report.status === filterStatus);

  const selectedReportData = selectedReport 
    ? SURVEY_REPORTS.find(r => r.id === selectedReport)
    : null;

  const statusCounts = {
    all: SURVEY_REPORTS.length,
    draft: SURVEY_REPORTS.filter(r => r.status === "draft").length,
    submitted: SURVEY_REPORTS.filter(r => r.status === "submitted").length,
    reviewed: SURVEY_REPORTS.filter(r => r.status === "reviewed").length,
    approved: SURVEY_REPORTS.filter(r => r.status === "approved").length,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Total Reports</div>
          <div className="mt-1 text-2xl font-semibold">{SURVEY_REPORTS.length}</div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">+3 this month</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Approved</div>
          <div className="mt-1 text-2xl font-semibold">{statusCounts.approved}</div>
          <div className="mt-1 text-xs text-muted-foreground">50% of total</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Pending Review</div>
          <div className="mt-1 text-2xl font-semibold">{statusCounts.submitted + statusCounts.reviewed}</div>
          <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">Requires attention</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Drafts</div>
          <div className="mt-1 text-2xl font-semibold">{statusCounts.draft}</div>
          <div className="mt-1 text-xs text-muted-foreground">In progress</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter by Status:</span>
          <div className="flex gap-2">
            {["all", "draft", "submitted", "reviewed", "approved"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {status === "all" ? "All" : STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label || status}
                {status !== "all" && (
                  <span className="ml-1 text-xs opacity-75">({statusCounts[status as keyof typeof statusCounts]})</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          New Survey Report
        </button>
      </div>

      {/* Reports List */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-4">
          <h3 className="text-base font-semibold">Survey Reports</h3>
        </div>
        <div className="divide-y">
          {filteredReports.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No reports found for the selected filter.
            </div>
          ) : (
            filteredReports.map((report) => {
              const statusInfo = STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG];
              const StatusIcon = statusInfo?.icon || FileText;
              
              return (
                <div
                  key={report.id}
                  className={`p-4 transition-colors hover:bg-muted/50 ${
                    selectedReport === report.id ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-sm font-semibold">{report.title}</h4>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusInfo?.color || ""}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo?.label || report.status}
                        </span>
                        <span className={`text-xs font-medium ${RISK_RATING_COLORS[report.riskRating as keyof typeof RISK_RATING_COLORS] || ""}`}>
                          Risk: {report.riskRating}
                        </span>
                      </div>
                      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3" />
                          <span>{report.client}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3" />
                          <span>{report.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          <span>Survey: {formatDate(report.surveyDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3 w-3" />
                          <span>{report.attachments} attachments</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{report.findings}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-muted-foreground">Surveyor: {report.surveyor}</span>
                        <span className="text-muted-foreground">Report Date: {formatDate(report.reportDate)}</span>
                        <span className={`font-medium ${
                          report.premiumImpact.startsWith("+") ? "text-red-600" :
                          report.premiumImpact.startsWith("-") ? "text-emerald-600" :
                          "text-muted-foreground"
                        }`}>
                          Premium Impact: {report.premiumImpact}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
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
                      {report.status === "draft" && (
                        <button
                          className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        className="rounded-md border border-muted bg-background p-2 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {selectedReport === report.id && (
                    <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                      <h5 className="mb-3 text-sm font-semibold">Report Details</h5>
                      <div className="grid gap-4 text-sm md:grid-cols-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Survey Type</div>
                          <div className="mt-1 font-medium">{report.surveyType}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Risk Rating</div>
                          <div className={`mt-1 font-medium ${RISK_RATING_COLORS[report.riskRating as keyof typeof RISK_RATING_COLORS] || ""}`}>
                            {report.riskRating}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Survey Date</div>
                          <div className="mt-1 font-medium">{formatDate(report.surveyDate)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Report Date</div>
                          <div className="mt-1 font-medium">{formatDate(report.reportDate)}</div>
                        </div>
                        <div className="md:col-span-2">
                          <div className="text-xs text-muted-foreground">Key Findings</div>
                          <div className="mt-1 font-medium">{report.findings}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Premium Impact</div>
                          <div className={`mt-1 font-medium ${
                            report.premiumImpact.startsWith("+") ? "text-red-600" :
                            report.premiumImpact.startsWith("-") ? "text-emerald-600" :
                            "text-muted-foreground"
                          }`}>
                            {report.premiumImpact}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Attachments</div>
                          <div className="mt-1 font-medium">{report.attachments} files</div>
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

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: "Approved", report: "SR-2024-001", user: "Admin", time: "2 hours ago" },
              { action: "Submitted for review", report: "SR-2024-004", user: "Emily Davis", time: "5 hours ago" },
              { action: "Draft updated", report: "SR-2024-005", user: "David Wilson", time: "1 day ago" },
              { action: "Reviewed", report: "SR-2024-007", user: "Manager", time: "2 days ago" },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1 text-sm">
                  <div>
                    <span className="font-medium">{activity.action}</span> - <span className="text-muted-foreground">{activity.report}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    by {activity.user} • {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold">Quick Stats</h3>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg. Survey Duration</span>
                <span className="font-semibold">5.2 days</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[65%] rounded-full bg-primary" />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Approval Rate</span>
                <span className="font-semibold">75%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[75%] rounded-full bg-emerald-500" />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">High Risk Reports</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[38%] rounded-full bg-red-500" />
              </div>
            </div>
            <div className="mt-4 rounded-lg border bg-muted/50 p-3">
              <div className="text-xs text-muted-foreground">Total Premium Impact</div>
              <div className="mt-1 text-lg font-semibold text-red-600">+R 475,000</div>
              <div className="text-xs text-muted-foreground">Based on approved reports</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

