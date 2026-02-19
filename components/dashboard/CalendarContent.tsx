"use client";
import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  Users,
  Building2,
  Shield,
  Calendar,
  TrendingUp,
  Filter,
  X,
  Eye,
} from "lucide-react";
import { formatDate, formatDateFull } from "@/lib/dateUtils";

interface CalendarEvent {
  id: string;
  title: string;
  type: "renewal" | "deadline" | "meeting" | "audit" | "submission" | "other";
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  client?: string;
  priority: "high" | "medium" | "low";
  status?: "pending" | "completed" | "in_progress";
  description?: string;
  location?: string;
  attendees?: string[];
}

const EVENTS: CalendarEvent[] = [
  {
    id: "EVT-001",
    title: "Policy Renewal - ABC Corporation",
    type: "renewal",
    date: "2024-12-20",
    time: "09:00",
    client: "ABC Corporation",
    priority: "high",
    status: "pending",
    description: "Annual policy renewal for ABC Corporation",
  },
  {
    id: "EVT-002",
    title: "Submission Deadline - XYZ Industries",
    type: "deadline",
    date: "2024-12-18",
    client: "XYZ Industries",
    priority: "high",
    status: "pending",
    description: "Final submission deadline for new policy application",
  },
  {
    id: "EVT-003",
    title: "Client Meeting - Global Tech Ltd",
    type: "meeting",
    date: "2024-12-16",
    time: "14:00",
    client: "Global Tech Ltd",
    priority: "medium",
    location: "Conference Room A",
    attendees: ["John Smith", "Sarah Johnson"],
    description: "Quarterly review meeting with client",
  },
  {
    id: "EVT-004",
    title: "Audit Completion - Retail Group SA",
    type: "audit",
    date: "2024-12-15",
    time: "10:00",
    client: "Retail Group SA",
    priority: "medium",
    status: "in_progress",
    description: "Final audit report submission",
  },
  {
    id: "EVT-005",
    title: "Policy Renewal - Manufacturing Co",
    type: "renewal",
    date: "2024-12-22",
    client: "Manufacturing Co",
    priority: "high",
    status: "pending",
    description: "Policy renewal due",
  },
  {
    id: "EVT-006",
    title: "Submission Review Meeting",
    type: "meeting",
    date: "2024-12-17",
    time: "11:00",
    priority: "medium",
    location: "Virtual",
    attendees: ["Michael Brown", "Emily Davis"],
    description: "Internal review of pending submissions",
  },
  {
    id: "EVT-007",
    title: "Deadline - Claims Documentation",
    type: "deadline",
    date: "2024-12-19",
    client: "Logistics Solutions",
    priority: "high",
    status: "pending",
    description: "Claims documentation submission deadline",
  },
  {
    id: "EVT-008",
    title: "Audit Start - Mining Operations Ltd",
    type: "audit",
    date: "2024-12-18",
    time: "09:00",
    client: "Mining Operations Ltd",
    priority: "high",
    status: "pending",
    description: "Annual compliance audit commencement",
  },
  {
    id: "EVT-009",
    title: "Policy Renewal - TechStart Inc",
    type: "renewal",
    date: "2024-12-21",
    client: "TechStart Inc",
    priority: "medium",
    status: "pending",
    description: "SME policy renewal",
  },
  {
    id: "EVT-010",
    title: "Client Onboarding - New Client",
    type: "meeting",
    date: "2024-12-19",
    time: "15:00",
    priority: "medium",
    location: "Client Office",
    attendees: ["David Wilson", "Lisa Anderson"],
    description: "New client onboarding session",
  },
  {
    id: "EVT-011",
    title: "Submission Deadline - Energy Solutions",
    type: "deadline",
    date: "2024-12-20",
    client: "Energy Solutions",
    priority: "high",
    status: "pending",
    description: "Policy amendment submission deadline",
  },
  {
    id: "EVT-012",
    title: "Audit Completion - Agricultural Holdings",
    type: "audit",
    date: "2024-12-16",
    time: "16:00",
    client: "Agricultural Holdings",
    priority: "medium",
    status: "completed",
    description: "Renewal audit completion",
  },
  {
    id: "EVT-013",
    title: "Policy Renewal - Construction Partners",
    type: "renewal",
    date: "2024-12-23",
    client: "Construction Partners",
    priority: "high",
    status: "pending",
    description: "SME policy renewal",
  },
  {
    id: "EVT-014",
    title: "Team Meeting - Weekly Review",
    type: "meeting",
    date: "2024-12-17",
    time: "10:00",
    priority: "low",
    location: "Conference Room B",
    attendees: ["All Team Members"],
    description: "Weekly team review and planning",
  },
  {
    id: "EVT-015",
    title: "Deadline - Risk Assessment Report",
    type: "deadline",
    date: "2024-12-18",
    client: "Energy Solutions",
    priority: "medium",
    status: "pending",
    description: "Risk assessment report submission",
  },
  {
    id: "EVT-016",
    title: "Policy Renewal - Retail Group SA",
    type: "renewal",
    date: "2024-12-25",
    client: "Retail Group SA",
    priority: "high",
    status: "pending",
    description: "Annual policy renewal",
  },
  {
    id: "EVT-017",
    title: "Submission Deadline - New Business",
    type: "deadline",
    date: "2024-12-19",
    priority: "high",
    status: "pending",
    description: "New business submission deadline",
  },
  {
    id: "EVT-018",
    title: "Client Meeting - XYZ Industries",
    type: "meeting",
    date: "2024-12-20",
    time: "13:00",
    client: "XYZ Industries",
    priority: "medium",
    location: "Client Office",
    attendees: ["Sarah Johnson", "Robert Taylor"],
    description: "Quarterly business review",
  },
  {
    id: "EVT-019",
    title: "Audit Start - Hospitality Group",
    type: "audit",
    date: "2024-12-21",
    time: "09:00",
    client: "Hospitality Group",
    priority: "medium",
    status: "pending",
    description: "Documentation audit commencement",
  },
  {
    id: "EVT-020",
    title: "Policy Renewal - Global Tech Ltd",
    type: "renewal",
    date: "2024-12-24",
    client: "Global Tech Ltd",
    priority: "high",
    status: "pending",
    description: "Annual policy renewal",
  },
];

const EVENT_TYPES = ["All Types", "Renewal", "Deadline", "Meeting", "Audit", "Submission", "Other"];
const PRIORITY_OPTIONS = ["All Priorities", "High", "Medium", "Low"];

function getEventTypeColor(type: string) {
  const colors: Record<string, string> = {
    renewal: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400",
    deadline: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400",
    meeting: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-400",
    audit: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-400",
    submission: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-400",
    other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400",
  };
  return colors[type] || colors.other;
}

function getEventTypeIcon(type: string) {
  const icons: Record<string, any> = {
    renewal: TrendingUp,
    deadline: AlertCircle,
    meeting: Users,
    audit: FileText,
    submission: FileText,
    other: CalendarIcon,
  };
  return icons[type] || CalendarIcon;
}

function getPriorityBadge(priority: string) {
  const config = {
    high: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400" },
    medium: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-400" },
    low: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400" },
  };
  const priorityConfig = config[priority as keyof typeof config] || config.medium;
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${priorityConfig.color}`}>
      {priority}
    </span>
  );
}

export default function CalendarContent() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 15)); // December 2024
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Generate calendar days
  const calendarDays: (Date | null)[] = [];
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  // Filter events
  const filteredEvents = EVENTS.filter((event) => {
    const eventDate = new Date(event.date);
    const isInCurrentMonth = eventDate.getMonth() === month && eventDate.getFullYear() === year;
    const matchesType = selectedType === "All Types" || event.type === selectedType.toLowerCase();
    const matchesPriority = selectedPriority === "All Priorities" || event.priority === selectedPriority.toLowerCase();
    return isInCurrentMonth && matchesType && matchesPriority;
  });

  // Get events for a specific date
  const getEventsForDate = (date: Date | null): CalendarEvent[] => {
    if (!date) return [];
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return filteredEvents.filter((event) => event.date === dateStr);
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();
  const isToday = (date: Date | null) => {
    if (!date) return false;
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const selectedDateEvents = selectedDate
    ? filteredEvents.filter((event) => event.date === selectedDate)
    : [];

  const selectedEventData = selectedEvent ? EVENTS.find((e) => e.id === selectedEvent) : null;

  const stats = {
    total: filteredEvents.length,
    renewals: filteredEvents.filter((e) => e.type === "renewal").length,
    deadlines: filteredEvents.filter((e) => e.type === "deadline").length,
    meetings: filteredEvents.filter((e) => e.type === "meeting").length,
    audits: filteredEvents.filter((e) => e.type === "audit").length,
    highPriority: filteredEvents.filter((e) => e.priority === "high").length,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Total Events</div>
              <div className="mt-1 text-2xl font-semibold">{stats.total}</div>
              <div className="mt-1 text-xs text-muted-foreground">This month</div>
            </div>
            <CalendarIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Renewals</div>
              <div className="mt-1 text-2xl font-semibold">{stats.renewals}</div>
              <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">Policy renewals</div>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Deadlines</div>
              <div className="mt-1 text-2xl font-semibold">{stats.deadlines}</div>
              <div className="mt-1 text-xs text-red-600 dark:text-red-400">Requires attention</div>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Meetings</div>
              <div className="mt-1 text-2xl font-semibold">{stats.meetings}</div>
              <div className="mt-1 text-xs text-purple-600 dark:text-purple-400">Scheduled</div>
            </div>
            <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">Calendar</h3>
          <button className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <CalendarIcon className="h-4 w-4" />
            New Event
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar View */}
      <div className="rounded-lg border bg-card shadow-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousMonth}
              className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-semibold">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={goToNextMonth}
              className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={goToToday}
            className="rounded-md border border-muted bg-background px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            Today
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Day Names */}
          <div className="mb-2 grid grid-cols-7 gap-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, idx) => {
              const eventsForDay = getEventsForDate(date);
              const dateStr = date
                ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                : null;
              const isSelected = dateStr === selectedDate;

              return (
                <div
                  key={idx}
                  onClick={() => date && setSelectedDate(dateStr)}
                  className={`min-h-[100px] rounded-lg border p-2 transition-colors ${
                    date
                      ? isToday(date)
                        ? "border-primary bg-primary/5"
                        : isSelected
                        ? "border-primary bg-primary/10"
                        : "border-muted bg-card hover:bg-muted/50"
                      : "border-transparent bg-transparent"
                  }`}
                >
                  {date && (
                    <>
                      <div className={`mb-1 text-sm font-medium ${isToday(date) ? "text-primary" : ""}`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {eventsForDay.slice(0, 3).map((event) => {
                          const EventIcon = getEventTypeIcon(event.type);
                          return (
                            <div
                              key={event.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(selectedEvent === event.id ? null : event.id);
                              }}
                              className={`cursor-pointer rounded px-1.5 py-0.5 text-xs font-medium ${getEventTypeColor(
                                event.type
                              )}`}
                              title={event.title}
                            >
                              <div className="flex items-center gap-1 truncate">
                                <EventIcon className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{event.title}</span>
                              </div>
                            </div>
                          );
                        })}
                        {eventsForDay.length > 3 && (
                          <div className="text-xs text-muted-foreground">+{eventsForDay.length - 3} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && selectedDateEvents.length > 0 && (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">
              Events on {formatDateFull(selectedDate)}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {selectedDateEvents.map((event) => {
              const EventIcon = getEventTypeIcon(event.type);
              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                    selectedEvent === event.id ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`rounded p-2 ${getEventTypeColor(event.type)}`}>
                        <EventIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold">{event.title}</h4>
                          {getPriorityBadge(event.priority)}
                        </div>
                        {event.client && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Building2 className="h-3 w-3" />
                            <span>{event.client}</span>
                          </div>
                        )}
                        {event.time && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.description && (
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(selectedEvent === event.id ? null : event.id);
                      }}
                      className="ml-2 rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Event Details */}
      {selectedEventData && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">Event Details</h3>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 text-sm md:grid-cols-2">
            <div>
              <div className="text-xs text-muted-foreground">Event ID</div>
              <div className="mt-1 font-medium">{selectedEventData.id}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Type</div>
              <div className="mt-1">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getEventTypeColor(selectedEventData.type)}`}>
                  {selectedEventData.type}
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Title</div>
              <div className="mt-1 font-medium">{selectedEventData.title}</div>
            </div>
            {selectedEventData.client && (
              <div>
                <div className="text-xs text-muted-foreground">Client</div>
                <div className="mt-1 font-medium">{selectedEventData.client}</div>
              </div>
            )}
            <div>
              <div className="text-xs text-muted-foreground">Date</div>
              <div className="mt-1 font-medium">{formatDate(selectedEventData.date)}</div>
            </div>
            {selectedEventData.time && (
              <div>
                <div className="text-xs text-muted-foreground">Time</div>
                <div className="mt-1 font-medium">{selectedEventData.time}</div>
              </div>
            )}
            <div>
              <div className="text-xs text-muted-foreground">Priority</div>
              <div className="mt-1">{getPriorityBadge(selectedEventData.priority)}</div>
            </div>
            {selectedEventData.status && (
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <div className="mt-1 font-medium capitalize">{selectedEventData.status}</div>
              </div>
            )}
            {selectedEventData.location && (
              <div>
                <div className="text-xs text-muted-foreground">Location</div>
                <div className="mt-1 font-medium">{selectedEventData.location}</div>
              </div>
            )}
            {selectedEventData.description && (
              <div className="md:col-span-2">
                <div className="text-xs text-muted-foreground">Description</div>
                <div className="mt-1 font-medium">{selectedEventData.description}</div>
              </div>
            )}
            {selectedEventData.attendees && selectedEventData.attendees.length > 0 && (
              <div className="md:col-span-2">
                <div className="text-xs text-muted-foreground">Attendees</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedEventData.attendees.map((attendee, idx) => (
                    <span key={idx} className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {attendee}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold">Upcoming Events</h3>
        <div className="space-y-3">
          {filteredEvents
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5)
            .map((event) => {
              const EventIcon = getEventTypeIcon(event.type);
              return (
                <div key={event.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`rounded p-2 ${getEventTypeColor(event.type)}`}>
                      <EventIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{event.title}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{formatDate(event.date)}</span>
                        {event.time && <span>• {event.time}</span>}
                        {event.client && <span>• {event.client}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getPriorityBadge(event.priority)}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

