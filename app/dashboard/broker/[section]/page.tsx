import DashboardShell from "@/components/layout/DashboardShell";
import SectionContent, { getSectionTitle } from "@/components/dashboard/SectionContent";

export default function BrokerSectionPage({ params }: { params: { section: string } }) {
  const title = getSectionTitle(params.section);
  return (
    <DashboardShell title={title}>
      <SectionContent section={params.section} />
    </DashboardShell>
  );
}


