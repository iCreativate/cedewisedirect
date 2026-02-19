"use client";
import { trpc } from "@/lib/trpcClient";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "@/lib/dateUtils";
import { ArrowLeft, Edit, FileText, Building2, Calendar, Shield, DollarSign, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
    SUBMITTED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    UNDER_REVIEW: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    ENDORSED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    APPROVED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    DECLINED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  };
  
  const icons: Record<string, any> = {
    DRAFT: FileText,
    SUBMITTED: Clock,
    UNDER_REVIEW: AlertCircle,
    ENDORSED: CheckCircle2,
    APPROVED: CheckCircle2,
    DECLINED: XCircle,
  };
  
  const Icon = icons[status] || FileText;
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${styles[status] || styles.DRAFT}`}>
      <Icon className="h-3 w-3" />
      {status.replace("_", " ")}
    </span>
  );
}

function formatCurrency(amount: number | string | null | undefined): string {
  if (!amount) return "R 0,00";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "R 0,00";
  const formatted = num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `R ${formatted.replace(".", ",")}`;
}

export default function ViewSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params?.id as string;
  
  const { data: submission, isLoading, error } = trpc.getSubmission.useQuery(
    { id: submissionId },
    { enabled: !!submissionId }
  );
  
  // Parse extra data from description
  const extraData = submission?.description?.includes("__EXTRA__")
    ? JSON.parse(submission.description.split("__EXTRA__:")[1] || "{}")
    : {};
  
  if (isLoading) {
    return (
      <DashboardShell title="Submission">
        <div className="flex items-center justify-center py-12">
          <div className="text-sm text-muted-foreground">Loading submission...</div>
        </div>
      </DashboardShell>
    );
  }
  
  if (error || !submission) {
    return (
      <DashboardShell title="Submission not found">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
          <div className="text-sm font-semibold text-foreground">Submission not found</div>
          <div className="mt-2 text-xs text-muted-foreground">The submission you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</div>
          <button
            onClick={() => router.back()}
            className="btn-secondary mt-4"
          >
            Go Back
          </button>
        </div>
      </DashboardShell>
    );
  }
  
  return (
    <DashboardShell title="Submission">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold">{submission.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">Submission Details</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(submission.status)}
            <button
              onClick={() => router.push(`/dashboard/submissions/${submissionId}/edit`)}
              className="btn-primary flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Main Details */}
          <div className="md:col-span-2 space-y-6">
            {/* General Information */}
            <div className="card-modern p-6">
              <h2 className="mb-4 text-lg font-semibold">General Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Client Name</label>
                  <p className="mt-1 text-sm font-medium">{submission.clientName}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Risk Type</label>
                  <p className="mt-1 text-sm font-medium">{submission.riskType}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Coverage Amount</label>
                  <p className="mt-1 text-sm font-medium">{formatCurrency(submission.coverageAmount)}</p>
                </div>
                {submission.premiumEstimate && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Premium Estimate</label>
                    <p className="mt-1 text-sm font-medium">{formatCurrency(submission.premiumEstimate)}</p>
                  </div>
                )}
                {submission.hazards && (
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Hazards</label>
                    <p className="mt-1 text-sm">{submission.hazards}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">Description</label>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{submission.description.split("__EXTRA__")[0]}</p>
                </div>
              </div>
            </div>
            
            {/* Extra Data - Policy Information */}
            {extraData.insuredName && (
              <div className="card-modern p-6">
                <h2 className="mb-4 text-lg font-semibold">Policy Information</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {extraData.insuredName && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Insured Name</label>
                      <p className="mt-1 text-sm font-medium">{extraData.insuredName}</p>
                    </div>
                  )}
                  {extraData.policyNo && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Policy Number</label>
                      <p className="mt-1 text-sm font-medium font-mono">{extraData.policyNo}</p>
                    </div>
                  )}
                  {extraData.marketer && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Marketer</label>
                      <p className="mt-1 text-sm font-medium">{extraData.marketer}</p>
                    </div>
                  )}
                  {extraData.startDate && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Start Date</label>
                      <p className="mt-1 text-sm font-medium">{extraData.startDate}</p>
                    </div>
                  )}
                  {extraData.endDate && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">End Date</label>
                      <p className="mt-1 text-sm font-medium">{extraData.endDate}</p>
                    </div>
                  )}
                  {extraData.effectiveDate && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Effective Date</label>
                      <p className="mt-1 text-sm font-medium">{extraData.effectiveDate}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Risk Details */}
            {extraData.riskAddress && (
              <div className="card-modern p-6">
                <h2 className="mb-4 text-lg font-semibold">Risk Details</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {extraData.riskAddress && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Risk Address</label>
                      <p className="mt-1 text-sm font-medium">{extraData.riskAddress}</p>
                    </div>
                  )}
                  {extraData.occupancyOfRisk && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Occupancy of Risk</label>
                      <p className="mt-1 text-sm font-medium">{extraData.occupancyOfRisk}</p>
                    </div>
                  )}
                  {extraData.construction && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Construction</label>
                      <p className="mt-1 text-sm font-medium">{extraData.construction}</p>
                    </div>
                  )}
                  {extraData.otherInformation && (
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-muted-foreground">Other Information</label>
                      <p className="mt-1 text-sm whitespace-pre-wrap">{extraData.otherInformation}</p>
                    </div>
                  )}
                  {extraData.renewalDetails && (
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-muted-foreground">Renewal/Endorsement Details</label>
                      <p className="mt-1 text-sm whitespace-pre-wrap">{extraData.renewalDetails}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Submission Info */}
            <div className="card-modern p-6">
              <h3 className="mb-4 text-sm font-semibold">Submission Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Created</div>
                    <div className="font-medium">{formatDate(submission.createdAt)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Last Updated</div>
                    <div className="font-medium">{formatDate(submission.updatedAt)}</div>
                  </div>
                </div>
                {submission.broker && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Submitted By</div>
                      <div className="font-medium">{submission.broker.name}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Attachments */}
            {submission.attachments && submission.attachments.length > 0 && (
              <div className="card-modern p-6">
                <h3 className="mb-4 text-sm font-semibold">Attachments ({submission.attachments.length})</h3>
                <div className="space-y-2">
                  {submission.attachments.map((attachment: any) => (
                    <div key={attachment.id} className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{attachment.fileName}</div>
                        <div className="text-xs text-muted-foreground">{attachment.fileType}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

