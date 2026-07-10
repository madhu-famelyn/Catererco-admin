import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { emailTemplates, notifications } from "@/lib/mock-data";
import { Send, Pencil } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const templateCols: Column<(typeof emailTemplates)[number]>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Template" },
    { key: "subject", header: "Subject" },
    { key: "updatedAt", header: "Updated" },
    { key: "actions", header: "", render: () => <Button size="sm" variant="ghost"><Pencil className="mr-1 h-4 w-4" /> Edit</Button> },
  ];
  const historyCols: Column<(typeof notifications)[number]>[] = [
    { key: "id", header: "ID" },
    { key: "title", header: "Title" },
    { key: "channel", header: "Channel" },
    { key: "audience", header: "Audience" },
    { key: "sentAt", header: "Sent At" },
  ];

  return (
    <>
      <PageHeader title="Notification Center" description="Templates, announcements and delivery history." />
      <div className="p-6">
        <Tabs defaultValue="send">
          <TabsList>
            <TabsTrigger value="send">Send Notification</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Compose</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Channel</Label>
                  <Select defaultValue="email">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="push">Push</SelectItem>
                      <SelectItem value="inapp">In-App</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Audience</Label>
                  <Select defaultValue="customers">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customers">All Customers</SelectItem>
                      <SelectItem value="caterers">All Caterers</SelectItem>
                      <SelectItem value="admins">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2"><Label>Title</Label><Input placeholder="Notification title" /></div>
                <div className="space-y-2 md:col-span-2"><Label>Message</Label><Textarea rows={6} placeholder="Write your message..." /></div>
                <div className="md:col-span-2 flex justify-end">
                  <Button onClick={() => toast.success("Notification sent")}><Send className="mr-2 h-4 w-4" /> Send</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-4">
            <DataTable data={emailTemplates} columns={templateCols} searchKeys={["name", "subject"]} />
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <DataTable data={notifications} columns={historyCols} searchKeys={["title", "audience"]} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
