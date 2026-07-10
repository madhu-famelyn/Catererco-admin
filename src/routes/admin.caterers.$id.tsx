import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { caterers } from "@/lib/mock-data";
import { ArrowLeft, Check, X, FileText, Download, MailPlus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/caterers/$id")({
  component: CatererDetail,
});

function CatererDetail() {
  const { id } = useParams({ from: "/admin/caterers/$id" });
  const c = caterers.find((x) => x.id === id) ?? caterers[0];

  return (
    <>
      <PageHeader
        title={c.name}
        description={`Caterer ID: ${c.id}`}
        actions={
          <>
            <Button variant="outline" asChild><Link to="/admin/caterers"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link></Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline"><MailPlus className="mr-2 h-4 w-4" /> Request Documents</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Request additional documents</DialogTitle></DialogHeader>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea rows={4} defaultValue="Please provide an updated Trade License and Owner ID." />
                </div>
                <DialogFooter>
                  <Button onClick={() => toast.success("Request sent to caterer")}>Send</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="destructive" onClick={() => toast.error("Caterer rejected")}><X className="mr-2 h-4 w-4" /> Reject</Button>
            <Button onClick={() => toast.success("Caterer approved")}><Check className="mr-2 h-4 w-4" /> Approve</Button>
          </>
        }
      />
      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Business Information</CardTitle>
              <StatusBadge status={c.status} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Owner" value={c.owner} />
            <Field label="Email" value={c.email} />
            <Field label="Phone" value={c.phone} />
            <Field label="City" value={c.city} />
            <Field label="Trade License" value={c.tradeLicense} />
            <Field label="VAT Number" value={c.vatNumber} />
            <Field label="Rating" value={`${c.rating} / 5`} />
            <Field label="Joined" value={c.joinedAt} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Performance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Metric label="Total bookings" value={c.bookings} />
            <Metric label="Total revenue" value={`AED ${c.revenue.toLocaleString()}`} />
            <Metric label="Commission earned" value={`AED ${Math.floor(c.revenue * 0.1).toLocaleString()}`} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader><CardTitle>Verification</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="documents">
              <TabsList>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="history">Verification History</TabsTrigger>
              </TabsList>
              <TabsContent value="documents" className="mt-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {c.documents.map((d) => (
                    <div key={d} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{d}</span>
                      </div>
                      <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-4 space-y-3">
                {[
                  { date: "2025-11-12", who: "Layla Admin", action: "Requested updated Trade License" },
                  { date: "2025-11-01", who: "System", action: "Documents received" },
                  { date: "2025-10-28", who: "Caterer", action: "Application submitted" },
                ].map((h, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{h.action}</p>
                      <p className="text-xs text-muted-foreground">{h.date} · {h.who}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
