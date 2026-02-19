"use client";
import { useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Globe,
  Moon,
  Sun,
  Palette,
  User,
  FileText,
  Download,
  Trash2,
  Save,
  X,
  CreditCard,
  Key,
  Database,
  Zap,
} from "lucide-react";

export default function SettingsContent() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      submissions: true,
      quotes: true,
      deadlines: true,
      reminders: true,
    },
    privacy: {
      profileVisibility: "team",
      showEmail: true,
      showPhone: false,
      dataSharing: false,
    },
    appearance: {
      theme: "system",
      language: "en",
      timezone: "Africa/Johannesburg",
      dateFormat: "DD/MM/YYYY",
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
    },
    preferences: {
      autoSave: true,
      defaultView: "list",
      itemsPerPage: 25,
      compactMode: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log("Settings saved:", settings);
  };

  const handlePasswordChange = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert("New passwords do not match");
      return;
    }
    if (passwordForm.new.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    // In a real app, this would update password via API
    alert("Password updated successfully");
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-muted-foreground" />
          <div>
            <h2 className="text-xl font-semibold">Settings</h2>
            <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Notifications */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-semibold">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Email Notifications</div>
                <div className="text-xs text-muted-foreground">Receive notifications via email</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, email: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Push Notifications</div>
                <div className="text-xs text-muted-foreground">Receive browser push notifications</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, push: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">SMS Notifications</div>
                <div className="text-xs text-muted-foreground">Receive notifications via SMS</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, sms: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div className="border-t pt-4">
              <div className="mb-3 text-xs font-medium text-muted-foreground">Notification Types</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Submissions</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.submissions}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, submissions: e.target.checked },
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quotes</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.quotes}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, quotes: e.target.checked },
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Deadlines</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.deadlines}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, deadlines: e.target.checked },
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reminders</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.reminders}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, reminders: e.target.checked },
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-semibold">Privacy</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Profile Visibility</label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, profileVisibility: e.target.value },
                  })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="public">Public</option>
                <option value="team">Team Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Show Email</div>
                <div className="text-xs text-muted-foreground">Display email address on profile</div>
              </div>
              <input
                type="checkbox"
                checked={settings.privacy.showEmail}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, showEmail: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Show Phone</div>
                <div className="text-xs text-muted-foreground">Display phone number on profile</div>
              </div>
              <input
                type="checkbox"
                checked={settings.privacy.showPhone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, showPhone: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Data Sharing</div>
                <div className="text-xs text-muted-foreground">Allow data sharing for analytics</div>
              </div>
              <input
                type="checkbox"
                checked={settings.privacy.dataSharing}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, dataSharing: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-semibold">Appearance</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Theme</label>
              <select
                value={settings.appearance.theme}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, theme: e.target.value },
                  })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Language</label>
              <select
                value={settings.appearance.language}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, language: e.target.value },
                  })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">English</option>
                <option value="af">Afrikaans</option>
                <option value="zu">Zulu</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Timezone</label>
              <select
                value={settings.appearance.timezone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, timezone: e.target.value },
                  })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Africa/Johannesburg">Africa/Johannesburg (GMT+2)</option>
                <option value="Africa/Cape_Town">Africa/Cape Town (GMT+2)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Date Format</label>
              <select
                value={settings.appearance.dateFormat}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, dateFormat: e.target.value },
                  })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-semibold">Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Two-Factor Authentication</div>
                <div className="text-xs text-muted-foreground">Add an extra layer of security</div>
              </div>
              <input
                type="checkbox"
                checked={settings.security.twoFactor}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: { ...settings.security, twoFactor: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: { ...settings.security, sessionTimeout: Number(e.target.value) },
                  })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Password Expiry (days)</label>
              <input
                type="number"
                value={settings.security.passwordExpiry}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: { ...settings.security, passwordExpiry: Number(e.target.value) },
                  })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-semibold">Preferences</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Auto-Save</div>
                <div className="text-xs text-muted-foreground">Automatically save changes</div>
              </div>
              <input
                type="checkbox"
                checked={settings.preferences.autoSave}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, autoSave: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Default View</label>
              <select
                value={settings.preferences.defaultView}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, defaultView: e.target.value },
                  })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="list">List</option>
                <option value="grid">Grid</option>
                <option value="table">Table</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Items Per Page</label>
              <input
                type="number"
                value={settings.preferences.itemsPerPage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, itemsPerPage: Number(e.target.value) },
                  })
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Compact Mode</div>
                <div className="text-xs text-muted-foreground">Show more items in less space</div>
              </div>
              <input
                type="checkbox"
                checked={settings.preferences.compactMode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, compactMode: e.target.checked },
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Key className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-semibold">Change Password</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Confirm New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={handlePasswordChange}
              className="w-full inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Lock className="h-4 w-4" />
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSave}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Save className="h-4 w-4" />
          Save All Settings
        </button>
      </div>
    </div>
  );
}

