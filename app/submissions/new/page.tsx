import SubmissionForm from "@/components/submissions/SubmissionForm";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function NewSubmissionPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  return (
    <div className="p-6">
      <SubmissionForm />
    </div>
  );
}

