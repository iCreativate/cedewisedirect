"use client";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpcClient";
import SubmissionForm from "@/components/submissions/SubmissionForm";
import DashboardShell from "@/components/layout/DashboardShell";
import { AlertCircle } from "lucide-react";

export default function EditSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params?.id as string;
  
  const { data: submission, isLoading, error } = trpc.getSubmission.useQuery(
    { id: submissionId },
    { enabled: !!submissionId }
  );
  
  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-12">
          <div className="text-sm text-muted-foreground">Loading submission...</div>
        </div>
      </DashboardShell>
    );
  }
  
  if (error || !submission) {
    return (
      <DashboardShell>
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
    <DashboardShell>
      <div className="mx-auto w-full max-w-6xl">
        <SubmissionForm submissionId={submissionId} initialData={submission} />
      </div>
    </DashboardShell>
  );
}


