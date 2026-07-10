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
import { Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader title="System Settings" description="Configure platform-wide preferences." />
      <div className="p-6">
        <Tabs defaultValue="platform">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="platform">Platform</TabsTrigger>
            <TabsTrigger value="commission">Commission</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="platform" className="mt-4">
            <SettingsCard title="Platform Configuration">
              <Field label="Platform Name"><Input defaultValue="CaterMarket" /></Field>
              <Field label="Support Email"><Input defaultValue="support@catermarket.ae" /></Field>
              <Field label="Booking Cutoff (hours)"><Input type="number" defaultValue={24} /></Field>
              <Toggle label="Maintenance mode" />
            </SettingsCard>
          </TabsContent>

          <TabsContent value="commission" className="mt-4">
            <SettingsCard title="Commission Settings">
              <Field label="Standard commission rate">
                <div className="space-y-2">
                  <Slider defaultValue={[10]} max={30} step={0.5} />
                  <p className="text-xs text-muted-foreground">Current: 10%</p>
                </div>
              </Field>
              <Field label="Minimum payout (AED)"><Input type="number" defaultValue={500} /></Field>
              <Field label="Payout schedule">
                <Select defaultValue="weekly">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="tax" className="mt-4">
            <SettingsCard title="Tax Settings">
              <Field label="VAT Rate (%)"><Input type="number" defaultValue={5} /></Field>
              <Field label="Tax ID"><Input defaultValue="100123456789012" /></Field>
              <Toggle label="Include VAT in displayed prices" />
            </SettingsCard>
          </TabsContent>

          <TabsContent value="currency" className="mt-4">
            <SettingsCard title="Currency">
              <Field label="Default Currency">
                <Select defaultValue="AED">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Currency Symbol Position">
                <Select defaultValue="prefix">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prefix">Before amount (AED 100)</SelectItem>
                    <SelectItem value="suffix">After amount (100 AED)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <SettingsCard title="Notification Settings">
              <Toggle label="Email notifications" />
              <Toggle label="SMS notifications" />
              <Toggle label="Push notifications" />
              <Toggle label="Weekly digest" />
            </SettingsCard>
          </TabsContent>

          <TabsContent value="ai" className="mt-4">
            <SettingsCard title="AI Configuration">
              <Field label="Menu extraction model">
                <Select defaultValue="google/gemini-2.5-flash">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google/gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                    <SelectItem value="google/gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                    <SelectItem value="openai/gpt-5">GPT-5</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Auto-approve threshold (%)"><Input type="number" defaultValue={95} /></Field>
              <Toggle label="Enable auto-reprocess on low confidence" />
            </SettingsCard>
          </TabsContent>

          <TabsContent value="security" className="mt-4">
            <SettingsCard title="Security Settings">
              <Toggle label="Require 2FA for admin accounts" />
              <Toggle label="Force password rotation every 90 days" />
              <Field label="Session timeout (minutes)"><Input type="number" defaultValue={60} /></Field>
              <Field label="Allowed IP ranges"><Input placeholder="e.g. 192.168.1.0/24" /></Field>
            </SettingsCard>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {children}
        <div className="md:col-span-2 flex justify-end">
          <Button onClick={() => toast.success("Settings saved")}><Save className="mr-2 h-4 w-4" /> Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}
function Toggle({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <Label className="text-sm">{label}</Label>
      <Switch defaultChecked />
    </div>
  );
}
