import AnalyticsContent from "./AnalyticsContent";
import HeatMapContent from "./HeatMapContent";
import SurveyReportContent from "./SurveyReportContent";
import DocumentsContent from "./DocumentsContent";
import ClientsContent from "./ClientsContent";
import AuditsContent from "./AuditsContent";
import CalendarContent from "./CalendarContent";
import SubmissionsContent from "./SubmissionsContent";
import QuotesContent from "./QuotesContent";
import CurrencyConvertorContent from "./CurrencyConvertorContent";
import LearningPortalContent from "./LearningPortalContent";
import ProfileContent from "./ProfileContent";
import SettingsContent from "./SettingsContent";

export function getSectionTitle(section: string): string {
  const map: Record<string, string> = {
    analytics: "Analytics",
    heatmap: "Heat Map",
    documents: "Documents",
    reports: "Survey Reports",
    clients: "Clients",
    audits: "Audits",
    calendar: "Calendar",
    submissions: "Submissions",
    quotes: "My Quote",
    currency: "Currency Convertor",
    learning: "Learning Portal",
    profile: "Profile",
    settings: "Settings",
  };
  return map[section] ?? section;
}

export default function SectionContent({ section }: { section: string }) {
  const title = getSectionTitle(section);

  // Special handling for analytics
  if (section === "analytics") {
    return <AnalyticsContent />;
  }

  // Special handling for heatmap
  if (section === "heatmap") {
    return <HeatMapContent />;
  }

  // Special handling for survey reports
  if (section === "reports") {
    return <SurveyReportContent />;
  }

  // Special handling for documents
  if (section === "documents") {
    return <DocumentsContent />;
  }

  // Special handling for clients
  if (section === "clients") {
    return <ClientsContent />;
  }

  // Special handling for audits
  if (section === "audits") {
    return <AuditsContent />;
  }

  // Special handling for calendar
  if (section === "calendar") {
    return <CalendarContent />;
  }

  // Special handling for submissions
  if (section === "submissions") {
    return <SubmissionsContent />;
  }

  // Special handling for quotes
  if (section === "quotes") {
    return <QuotesContent />;
  }

  // Special handling for currency convertor
  if (section === "currency") {
    return <CurrencyConvertorContent />;
  }

  // Special handling for learning portal
  if (section === "learning") {
    return <LearningPortalContent />;
  }

  // Special handling for profile
  if (section === "profile") {
    return <ProfileContent />;
  }

  // Special handling for settings
  if (section === "settings") {
    return <SettingsContent />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This is the {title.toLowerCase()} section. Replace this with real data and UI widgets.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium">Overview</div>
          <p className="mt-1 text-xs text-muted-foreground">Key info and quick actions.</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium">Recent Activity</div>
          <p className="mt-1 text-xs text-muted-foreground">Latest updates related to {title.toLowerCase()}.</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium">Shortcuts</div>
          <p className="mt-1 text-xs text-muted-foreground">Frequently used operations.</p>
        </div>
      </div>
    </div>
  );
}


