import DashboardShell from "@/components/layout/DashboardShell";
import SubmissionForm from "@/components/submissions/SubmissionForm";

export default function NewSubmissionInDashboard() {
  return (
    <DashboardShell title="New Submission">
      <SubmissionForm />
    </DashboardShell>
  );
}


