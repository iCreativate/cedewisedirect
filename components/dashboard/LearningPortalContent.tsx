"use client";
import { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Video,
  FileText,
  CheckCircle2,
  Clock,
  Play,
  Download,
  Bookmark,
  Search,
  Filter,
  X,
  Award,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/dateUtils";

const COURSES = [
  {
    id: "CRS-001",
    title: "Introduction to Commercial Insurance",
    category: "Fundamentals",
    level: "Beginner",
    duration: "2 hours",
    instructor: "John Smith",
    status: "completed",
    progress: 100,
    rating: 4.8,
    students: 1250,
    description: "Learn the basics of commercial insurance, including types of coverage, risk assessment, and policy structures.",
    modules: 8,
    completedModules: 8,
    thumbnail: "📚",
    tags: ["Insurance Basics", "Commercial", "Fundamentals"],
  },
  {
    id: "CRS-002",
    title: "Advanced Risk Assessment Techniques",
    category: "Risk Management",
    level: "Advanced",
    duration: "4 hours",
    instructor: "Sarah Johnson",
    status: "in_progress",
    progress: 65,
    rating: 4.9,
    students: 890,
    description: "Master advanced risk assessment methodologies and tools used in the insurance industry.",
    modules: 12,
    completedModules: 8,
    thumbnail: "📊",
    tags: ["Risk Assessment", "Advanced", "Analytics"],
  },
  {
    id: "CRS-003",
    title: "Underwriting Best Practices",
    category: "Underwriting",
    level: "Intermediate",
    duration: "3 hours",
    instructor: "Michael Brown",
    status: "not_started",
    progress: 0,
    rating: 4.7,
    students: 650,
    description: "Comprehensive guide to underwriting practices, evaluation criteria, and decision-making processes.",
    modules: 10,
    completedModules: 0,
    thumbnail: "✍️",
    tags: ["Underwriting", "Best Practices", "Intermediate"],
  },
  {
    id: "CRS-004",
    title: "Claims Processing and Management",
    category: "Claims",
    level: "Intermediate",
    duration: "2.5 hours",
    instructor: "Emily Davis",
    status: "completed",
    progress: 100,
    rating: 4.6,
    students: 1100,
    description: "Learn efficient claims processing workflows, documentation, and customer communication strategies.",
    modules: 7,
    completedModules: 7,
    thumbnail: "📋",
    tags: ["Claims", "Processing", "Management"],
  },
  {
    id: "CRS-005",
    title: "Regulatory Compliance in Insurance",
    category: "Compliance",
    level: "Intermediate",
    duration: "3.5 hours",
    instructor: "David Wilson",
    status: "in_progress",
    progress: 40,
    rating: 4.8,
    students: 750,
    description: "Understanding regulatory requirements, compliance frameworks, and audit procedures in insurance.",
    modules: 9,
    completedModules: 4,
    thumbnail: "⚖️",
    tags: ["Compliance", "Regulatory", "Legal"],
  },
  {
    id: "CRS-006",
    title: "Cyber Insurance Fundamentals",
    category: "Specialty",
    level: "Beginner",
    duration: "2 hours",
    instructor: "Lisa Anderson",
    status: "not_started",
    progress: 0,
    rating: 4.9,
    students: 520,
    description: "Introduction to cyber insurance, coverage types, and emerging threats in the digital landscape.",
    modules: 6,
    completedModules: 0,
    thumbnail: "💻",
    tags: ["Cyber", "Technology", "Emerging Risks"],
  },
  {
    id: "CRS-007",
    title: "Customer Relationship Management",
    category: "Sales & Marketing",
    level: "Beginner",
    duration: "2 hours",
    instructor: "Robert Taylor",
    status: "completed",
    progress: 100,
    rating: 4.5,
    students: 980,
    description: "Build strong customer relationships and improve client retention in the insurance industry.",
    modules: 5,
    completedModules: 5,
    thumbnail: "🤝",
    tags: ["Sales", "Customer Service", "CRM"],
  },
  {
    id: "CRS-008",
    title: "Data Analytics for Insurance Professionals",
    category: "Analytics",
    level: "Advanced",
    duration: "5 hours",
    instructor: "Jennifer Martinez",
    status: "not_started",
    progress: 0,
    rating: 4.7,
    students: 420,
    description: "Learn to leverage data analytics tools and techniques for better decision-making in insurance.",
    modules: 15,
    completedModules: 0,
    thumbnail: "📈",
    tags: ["Analytics", "Data", "Advanced"],
  },
];

const CERTIFICATIONS = [
  {
    id: "CERT-001",
    title: "Certified Insurance Professional (CIP)",
    issuer: "Insurance Institute",
    status: "earned",
    earnedDate: "2024-10-15",
    expiryDate: "2027-10-15",
    description: "Professional certification in insurance fundamentals and practices.",
  },
  {
    id: "CERT-002",
    title: "Risk Management Specialist",
    issuer: "Risk Management Association",
    status: "in_progress",
    progress: 75,
    expectedDate: "2025-02-01",
    description: "Advanced certification in risk assessment and management strategies.",
  },
  {
    id: "CERT-003",
    title: "Underwriting Excellence Certificate",
    issuer: "Insurance Academy",
    status: "available",
    description: "Certificate program focusing on underwriting best practices and techniques.",
  },
];

const CATEGORIES = ["All Categories", "Fundamentals", "Risk Management", "Underwriting", "Claims", "Compliance", "Specialty", "Sales & Marketing", "Analytics"];
const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const STATUS_OPTIONS = ["All Statuses", "Not Started", "In Progress", "Completed"];

function getStatusBadge(status: string) {
  const config = {
    completed: {
      label: "Completed",
      color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-400",
      icon: CheckCircle2,
    },
    in_progress: {
      label: "In Progress",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400",
      icon: Clock,
    },
    not_started: {
      label: "Not Started",
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400",
      icon: BookOpen,
    },
  };
  const statusConfig = config[status as keyof typeof config] || config.not_started;
  const Icon = statusConfig.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusConfig.color}`}>
      <Icon className="h-3 w-3" />
      {statusConfig.label}
    </span>
  );
}

export default function LearningPortalContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  const filteredCourses = COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
    const matchesStatus =
      selectedStatus === "All Statuses" ||
      (selectedStatus === "Not Started" && course.status === "not_started") ||
      (selectedStatus === "In Progress" && course.status === "in_progress") ||
      (selectedStatus === "Completed" && course.status === "completed");
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  const stats = {
    total: COURSES.length,
    completed: COURSES.filter((c) => c.status === "completed").length,
    inProgress: COURSES.filter((c) => c.status === "in_progress").length,
    notStarted: COURSES.filter((c) => c.status === "not_started").length,
    totalProgress: Math.round(
      COURSES.reduce((sum, c) => sum + c.progress, 0) / COURSES.length
    ),
    certificates: CERTIFICATIONS.filter((c) => c.status === "earned").length,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Total Courses</div>
              <div className="mt-1 text-2xl font-semibold">{stats.total}</div>
              <div className="mt-1 text-xs text-muted-foreground">Available to you</div>
            </div>
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Completed</div>
              <div className="mt-1 text-2xl font-semibold">{stats.completed}</div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                {Math.round((stats.completed / stats.total) * 100)}% completion
              </div>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">In Progress</div>
              <div className="mt-1 text-2xl font-semibold">{stats.inProgress}</div>
              <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">Continue learning</div>
            </div>
            <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Certificates</div>
              <div className="mt-1 text-2xl font-semibold">{stats.certificates}</div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">Earned</div>
            </div>
            <Award className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">Learning Portal</h3>
        </div>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses by title, description, or instructor..."
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
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
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <div key={course.id} className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 flex items-start justify-between">
              <div className="text-4xl">{course.thumbnail}</div>
              {getStatusBadge(course.status)}
            </div>
            <h4 className="mb-2 text-sm font-semibold">{course.title}</h4>
            <p className="mb-3 text-xs text-muted-foreground line-clamp-2">{course.description}</p>
            <div className="mb-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Instructor:</span>
                <span className="font-medium">{course.instructor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Level:</span>
                <span className="font-medium">{course.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{course.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Modules:</span>
                <span className="font-medium">
                  {course.completedModules}/{course.modules}
                </span>
              </div>
            </div>
            {course.status === "in_progress" && (
              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            )}
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{course.students} students</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {course.tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              {course.status === "not_started" ? (
                <button className="flex-1 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <Play className="h-4 w-4" />
                  Start Course
                </button>
              ) : course.status === "in_progress" ? (
                <button className="flex-1 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <Play className="h-4 w-4" />
                  Continue
                </button>
              ) : (
                <button className="flex-1 inline-flex h-9 items-center justify-center gap-2 rounded-md border border-muted bg-background px-4 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  Review
                </button>
              )}
              <button className="rounded-md border border-muted bg-background p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold">Certifications</h3>
        <div className="space-y-4">
          {CERTIFICATIONS.map((cert) => (
            <div key={cert.id} className="flex items-start justify-between rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <div className="rounded-lg border bg-muted p-3">
                  <Award className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{cert.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{cert.description}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Issued by: {cert.issuer}
                  </div>
                  {cert.status === "earned" && cert.earnedDate && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Earned: {formatDate(cert.earnedDate)}
                      {cert.expiryDate && ` • Expires: ${formatDate(cert.expiryDate)}`}
                    </div>
                  )}
                  {cert.status === "in_progress" && cert.progress && (
                    <div className="mt-2">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span>Progress</span>
                        <span>{cert.progress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${cert.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                {cert.status === "earned" && (
                  <button className="rounded-md border border-muted bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                    <Download className="h-4 w-4" />
                  </button>
                )}
                {cert.status === "available" && (
                  <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Enroll
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

