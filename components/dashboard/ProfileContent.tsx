"use client";
import { useState } from "react";
import {
  UserCircle,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Shield,
  Award,
  FileText,
  Edit,
  Save,
  X,
  Camera,
  Bell,
  Lock,
  CreditCard,
  Settings as SettingsIcon,
} from "lucide-react";
import { formatDate } from "@/lib/dateUtils";

const MOCK_PROFILE = {
  id: "USR-001",
  name: "John Smith",
  email: "john.smith@cedewise.com",
  phone: "+27 11 234 5678",
  role: "Broker",
  department: "Sales & Client Relations",
  office: "Johannesburg Office",
  address: "123 Insurance Street, Sandton, Johannesburg, 2196",
  joinDate: "2023-01-15",
  employeeId: "EMP-2023-0015",
  manager: "Sarah Johnson",
  bio: "Experienced insurance broker with 8 years in commercial insurance. Specializing in property and liability coverage for corporate clients.",
  avatar: null,
  certifications: [
    { id: "CERT-001", name: "Certified Insurance Professional", year: "2023" },
    { id: "CERT-002", name: "Risk Management Specialist", year: "2022" },
  ],
  skills: ["Commercial Insurance", "Risk Assessment", "Client Relations", "Underwriting"],
  stats: {
    totalSubmissions: 42,
    approvedSubmissions: 28,
    totalClients: 15,
    totalPremium: 12500000,
    completionRate: 87,
  },
};

const ACTIVITY_ITEMS = [
  { id: 1, type: "submission", action: "Created new submission", item: "POL-20241215-0001", date: "2024-12-15 10:30" },
  { id: 2, type: "quote", action: "Generated quote", item: "QTE-20241214-0032", date: "2024-12-14 14:20" },
  { id: 3, type: "client", action: "Updated client information", item: "ABC Corporation", date: "2024-12-13 09:15" },
  { id: 4, type: "document", action: "Uploaded document", item: "Policy Document", date: "2024-12-12 16:45" },
  { id: 5, type: "quote", action: "Quote accepted", item: "QTE-20241211-0008", date: "2024-12-11 11:30" },
];

export default function ProfileContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [editedProfile, setEditedProfile] = useState(MOCK_PROFILE);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-4 border-background bg-muted flex items-center justify-center">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                <UserCircle className="h-16 w-16 text-muted-foreground" />
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 rounded-full border-2 border-background bg-background p-2 hover:bg-accent transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{profile.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{profile.role} • {profile.department}</p>
                <p className="mt-1 text-sm text-muted-foreground">{profile.office}</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-muted bg-background px-4 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-muted bg-background px-4 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{profile.bio}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Total Submissions</div>
          <div className="mt-1 text-2xl font-semibold">{profile.stats.totalSubmissions}</div>
          <div className="mt-1 text-xs text-muted-foreground">{profile.stats.approvedSubmissions} approved</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Total Clients</div>
          <div className="mt-1 text-2xl font-semibold">{profile.stats.totalClients}</div>
          <div className="mt-1 text-xs text-muted-foreground">Active relationships</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Total Premium</div>
          <div className="mt-1 text-2xl font-semibold">R {(profile.stats.totalPremium / 1000000).toFixed(1)}M</div>
          <div className="mt-1 text-xs text-muted-foreground">Managed portfolio</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">Completion Rate</div>
          <div className="mt-1 text-2xl font-semibold">{profile.stats.completionRate}%</div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">Above average</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.name}</span>
                </div>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Address</label>
              {isEditing ? (
                <textarea
                  value={editedProfile.address}
                  onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                />
              ) : (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span>{profile.address}</span>
                </div>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Bio</label>
              {isEditing ? (
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold">Work Information</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Role</label>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>{profile.role}</span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Department</label>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{profile.department}</span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Office</label>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profile.office}</span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Employee ID</label>
              <div className="text-sm font-medium">{profile.employeeId}</div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Join Date</label>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(profile.joinDate)}</span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Manager</label>
              <div className="text-sm font-medium">{profile.manager}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications & Skills */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold">Certifications</h3>
          <div className="space-y-3">
            {profile.certifications.map((cert) => (
              <div key={cert.id} className="flex items-center gap-3 rounded-lg border p-3">
                <Award className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{cert.name}</div>
                  <div className="text-xs text-muted-foreground">Earned in {cert.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, idx) => (
              <span key={idx} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold">Recent Activity</h3>
        <div className="space-y-3">
          {ACTIVITY_ITEMS.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="rounded border bg-muted p-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm font-medium">{activity.action}</div>
                  <div className="text-xs text-muted-foreground">{activity.item}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{activity.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

