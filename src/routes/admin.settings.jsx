import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Save, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

const DEFAULT_SETTINGS = {
  platformName: "CatererCo",
  supportEmail: "support@catererco.ae",
  bookingCutoffHours: 24,
  maintenanceMode: false,
  commissionRate: 10,
  minPayout: 500,
  payoutSchedule: "weekly",
  vatRate: 5,
  taxId: "100123456789012",
  includeVatInDisplay: true,
  currency: "AED",
  currencyPosition: "prefix",
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: true,
  weeklyDigest: true,
  // AI Settings
  aiModel: "google/gemini-2.5-flash",
  autoApproveThreshold: 95,
  autoReprocessLowConfidence: true,
  // Security
  require2FA: true,
  forcePasswordRotation: false,
  sessionTimeout: 60,
  allowedIpRanges: "",
};

function SettingsPage() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("admin_system_settings");
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_SETTINGS;
  });

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (categoryName = "Settings") => {
    try {
      localStorage.setItem("admin_system_settings", JSON.stringify(settings));
      toast.success(`${categoryName} saved successfully!`);
    } catch (e) {
      toast.error("Failed to save settings.");
    }
  };

  return (
    <>
      <PageHeader title="System Settings" description="Configure platform-wide preferences and AI extraction engine." />
      <div className="p-6">
        <Tabs defaultValue="ai">
          <TabsList className="w-full justify-start flex-wrap gap-1 h-auto p-1.5 bg-muted/60">
            <TabsTrigger value="ai" className="gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> AI Configuration
            </TabsTrigger>
            <TabsTrigger value="platform">Platform</TabsTrigger>
            <TabsTrigger value="commission">Commission</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* AI Settings Tab */}
          <TabsContent value="ai" className="mt-4">
            <SettingsCard title="AI Extraction & Recommendation Configuration" onSave={() => handleSave("AI Configuration")}>
              <Field label="Menu Extraction & Parsing Model">
                <Select value={settings.aiModel} onValueChange={(val) => updateSetting("aiModel", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google/gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Ultra Fast)</SelectItem>
                    <SelectItem value="google/gemini-2.5-pro">Gemini 2.5 Pro (High Accuracy)</SelectItem>
                    <SelectItem value="openai/gpt-5">GPT-5 (Experimental)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Auto-Approve Menu Threshold (%)">
                <Input
                  type="number"
                  min={50}
                  max={100}
                  value={settings.autoApproveThreshold}
                  onChange={(e) => updateSetting("autoApproveThreshold", Number(e.target.value))}
                />
              </Field>

              <Toggle
                label="Enable Auto-Reprocess on Low Confidence Scores"
                checked={settings.autoReprocessLowConfidence}
                onCheckedChange={(val) => updateSetting("autoReprocessLowConfidence", val)}
              />

              <div className="md:col-span-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-400 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300">Active Engine: </span>
                  Current AI model is active across Menu PDF Parser, Menu Builder recommendations, and Quotation auto-checkers.
                </div>
              </div>
            </SettingsCard>
          </TabsContent>

          {/* Platform Tab */}
          <TabsContent value="platform" className="mt-4">
            <SettingsCard title="Platform Configuration" onSave={() => handleSave("Platform Configuration")}>
              <Field label="Platform Name">
                <Input value={settings.platformName} onChange={(e) => updateSetting("platformName", e.target.value)} />
              </Field>
              <Field label="Support Email">
                <Input value={settings.supportEmail} onChange={(e) => updateSetting("supportEmail", e.target.value)} />
              </Field>
              <Field label="Booking Cutoff (hours)">
                <Input
                  type="number"
                  value={settings.bookingCutoffHours}
                  onChange={(e) => updateSetting("bookingCutoffHours", Number(e.target.value))}
                />
              </Field>
              <Toggle
                label="Maintenance Mode"
                checked={settings.maintenanceMode}
                onCheckedChange={(val) => updateSetting("maintenanceMode", val)}
              />
            </SettingsCard>
          </TabsContent>

          {/* Commission Tab */}
          <TabsContent value="commission" className="mt-4">
            <SettingsCard title="Commission Settings" onSave={() => handleSave("Commission Settings")}>
              <Field label="Standard Commission Rate">
                <div className="space-y-2">
                  <Slider
                    value={[settings.commissionRate]}
                    onValueChange={(val) => updateSetting("commissionRate", val[0])}
                    max={30}
                    step={0.5}
                  />
                  <p className="text-xs text-muted-foreground">Current Rate: {settings.commissionRate}%</p>
                </div>
              </Field>
              <Field label="Minimum Payout (AED)">
                <Input
                  type="number"
                  value={settings.minPayout}
                  onChange={(e) => updateSetting("minPayout", Number(e.target.value))}
                />
              </Field>
              <Field label="Payout Schedule">
                <Select value={settings.payoutSchedule} onValueChange={(val) => updateSetting("payoutSchedule", val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </SettingsCard>
          </TabsContent>

          {/* Tax Tab */}
          <TabsContent value="tax" className="mt-4">
            <SettingsCard title="Tax Settings" onSave={() => handleSave("Tax Settings")}>
              <Field label="VAT Rate (%)">
                <Input
                  type="number"
                  value={settings.vatRate}
                  onChange={(e) => updateSetting("vatRate", Number(e.target.value))}
                />
              </Field>
              <Field label="Tax TRN ID">
                <Input value={settings.taxId} onChange={(e) => updateSetting("taxId", e.target.value)} />
              </Field>
              <Toggle
                label="Include VAT in displayed prices"
                checked={settings.includeVatInDisplay}
                onCheckedChange={(val) => updateSetting("includeVatInDisplay", val)}
              />
            </SettingsCard>
          </TabsContent>

          {/* Currency Tab */}
          <TabsContent value="currency" className="mt-4">
            <SettingsCard title="Currency Preferences" onSave={() => handleSave("Currency Preferences")}>
              <Field label="Default Currency">
                <Select value={settings.currency} onValueChange={(val) => updateSetting("currency", val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Currency Symbol Position">
                <Select value={settings.currencyPosition} onValueChange={(val) => updateSetting("currencyPosition", val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prefix">Before amount (AED 100)</SelectItem>
                    <SelectItem value="suffix">After amount (100 AED)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </SettingsCard>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-4">
            <SettingsCard title="Notification Settings" onSave={() => handleSave("Notification Settings")}>
              <Toggle
                label="Email notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(val) => updateSetting("emailNotifications", val)}
              />
              <Toggle
                label="SMS notifications"
                checked={settings.smsNotifications}
                onCheckedChange={(val) => updateSetting("smsNotifications", val)}
              />
              <Toggle
                label="Push notifications"
                checked={settings.pushNotifications}
                onCheckedChange={(val) => updateSetting("pushNotifications", val)}
              />
              <Toggle
                label="Weekly summary digest"
                checked={settings.weeklyDigest}
                onCheckedChange={(val) => updateSetting("weeklyDigest", val)}
              />
            </SettingsCard>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-4">
            <SettingsCard title="Security Settings" onSave={() => handleSave("Security Settings")}>
              <Toggle
                label="Require 2FA for admin accounts"
                checked={settings.require2FA}
                onCheckedChange={(val) => updateSetting("require2FA", val)}
              />
              <Toggle
                label="Force password rotation every 90 days"
                checked={settings.forcePasswordRotation}
                onCheckedChange={(val) => updateSetting("forcePasswordRotation", val)}
              />
              <Field label="Session timeout (minutes)">
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => updateSetting("sessionTimeout", Number(e.target.value))}
                />
              </Field>
              <Field label="Allowed IP ranges">
                <Input
                  placeholder="e.g. 192.168.1.0/24"
                  value={settings.allowedIpRanges}
                  onChange={(e) => updateSetting("allowedIpRanges", e.target.value)}
                />
              </Field>
            </SettingsCard>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function SettingsCard({ title, children, onSave }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {children}
        <div className="md:col-span-2 flex justify-end">
          <Button onClick={onSave} className="bg-primary text-primary-foreground">
            <Save className="mr-2 h-4 w-4" /> Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onCheckedChange }) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <Label className="text-sm cursor-pointer">{label}</Label>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
