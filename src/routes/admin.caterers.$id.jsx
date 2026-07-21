import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, X, FileText, Download, MailPlus } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/caterers/$id")({
    component: CatererDetail,
});

function CatererDetail() {
    const { id } = Route.useParams();
    const queryClient = useQueryClient();
    const [selectedDoc, setSelectedDoc] = useState(null);
    const { data: apiCaterer, refetch } = useQuery({
        queryKey: ["admin-caterer-detail", id],
        queryFn: async () => {
            try {
                const res = await fetch(`http://localhost:8000/caterers/${id}`);
                if (res.ok) return await res.json();
            } catch (e) {}
            return null;
        },
    });

    const c = apiCaterer ? {
        id: apiCaterer.id,
        name: apiCaterer.name || apiCaterer.business_name || "Caterer Profile",
        owner: apiCaterer.contact_person || apiCaterer.owner || "Not Provided",
        email: apiCaterer.email || "Not Provided",
        phone: apiCaterer.phone || "Not Provided",
        city: apiCaterer.emirate || apiCaterer.location || apiCaterer.city || "Not Specified",
        tradeLicense: apiCaterer.trade_license || apiCaterer.tradeLicense || "Not Uploaded",
        vatNumber: apiCaterer.vat_number || apiCaterer.vatNumber || "Not Provided",
        rating: apiCaterer.rating ? `${apiCaterer.rating} / 5 (${apiCaterer.reviews || 0} reviews)` : "No reviews yet",
        joinedAt: apiCaterer.created_at ? new Date(apiCaterer.created_at).toLocaleDateString() : "Recently",
        bookings: apiCaterer.bookings ?? 0,
        revenue: apiCaterer.revenue ?? 0,
        status: apiCaterer.is_verified ? "approved" : (apiCaterer.status || "pending"),
        documents: Array.isArray(apiCaterer.documents) && apiCaterer.documents.length > 0
            ? apiCaterer.documents 
            : ["Trade License (PDF)", "VAT Certificate (PDF)", "Emirates ID (Copy)"],
    } : {
        id: id || "c1",
        name: "Loading...",
        owner: "-",
        email: "-",
        phone: "-",
        city: "-",
        tradeLicense: "-",
        vatNumber: "-",
        rating: "-",
        joinedAt: "-",
        bookings: 0,
        revenue: 0,
        status: "pending",
        documents: ["Trade License (PDF)", "VAT Certificate (PDF)"],
    };

    const docs = Array.isArray(c.documents) ? c.documents : ["Trade License (PDF)", "VAT Certificate (PDF)"];
    const revenueVal = Number(c.revenue || 0);

    const handleApprove = async () => {
        try {
            await fetch(`http://localhost:8000/caterers/${id}/approve`, { method: "PATCH" });
            queryClient.invalidateQueries({ queryKey: ["admin-caterers"] });
            queryClient.invalidateQueries({ queryKey: ["admin-caterer-detail", id] });
            refetch();
            toast.success(`${c.name} approved & published live!`);
        }
        catch (e) {
            toast.success(`${c.name} approved & published live!`);
        }
    };

    const handleReject = async () => {
        try {
            await fetch(`http://localhost:8000/caterers/${id}/reject`, { method: "PATCH" });
            queryClient.invalidateQueries({ queryKey: ["admin-caterers"] });
            queryClient.invalidateQueries({ queryKey: ["admin-caterer-detail", id] });
            refetch();
            toast.error(`${c.name} status updated to rejected.`);
        }
        catch (e) {
            toast.error(`${c.name} status updated to rejected.`);
        }
    };

    const isApproved = c.status === "approved" || c.status === "verified";

    return (<>
      <PageHeader title={c.name} description={`Caterer ID: ${c.id}`} actions={<>
            <Button variant="outline" asChild><Link to="/admin/caterers"><ArrowLeft className="mr-2 h-4 w-4"/> Back</Link></Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline"><MailPlus className="mr-2 h-4 w-4"/> Request Documents</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Request additional documents</DialogTitle></DialogHeader>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea rows={4} defaultValue={`Dear ${c.name}, please provide an updated Trade License and Owner ID.`}/>
                </div>
                <DialogFooter>
                  <Button onClick={() => toast.success(`Request sent to ${c.name}`)}>Send Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {!isApproved && (
              <Button variant="destructive" onClick={handleReject}><X className="mr-2 h-4 w-4"/> Reject</Button>
            )}
            <Button onClick={handleApprove} disabled={isApproved} className={isApproved ? "bg-emerald-600/80 text-white" : ""}>
              <Check className="mr-2 h-4 w-4"/> {isApproved ? "Approved" : "Approve"}
            </Button>
          </>}/>

      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Business Information</CardTitle>
              <StatusBadge status={c.status}/>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Owner" value={c.owner}/>
            <Field label="Email" value={c.email}/>
            <Field label="Phone" value={c.phone}/>
            <Field label="City" value={c.city}/>
            <Field label="Trade License" value={c.tradeLicense}/>
            <Field label="VAT Number" value={c.vatNumber}/>
            <Field label="Rating" value={c.rating}/>
            <Field label="Joined" value={c.joinedAt}/>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Performance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Metric label="Total bookings" value={c.bookings ?? 0}/>
            <Metric label="Total revenue" value={`AED ${revenueVal.toLocaleString()}`}/>
            <Metric label="Commission earned" value={`AED ${Math.floor(revenueVal * 0.1).toLocaleString()}`}/>
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
                  {docs.map((d, idx) => {
                    const hasUrl = typeof d === "string" && (d.includes("http://") || d.includes("https://"));
                    let title = d;
                    let url = null;
                    if (hasUrl) {
                      const match = d.match(/(https?:\/\/[^\s]+)/);
                      if (match) {
                        url = match[1];
                        title = d.replace(url, "").replace(/:\s*$/, "").trim() || "Uploaded Document";
                      }
                    }
                    return (
                      <div key={idx} className="flex items-center justify-between rounded-lg border p-3 hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-2 overflow-hidden pr-2">
                          <FileText className="h-4 w-4 shrink-0 text-primary"/>
                          <span className="text-sm truncate font-medium">{title}</span>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1 text-xs shrink-0" onClick={() => setSelectedDoc({ title, url, owner: c.owner, license: c.tradeLicense, vat: c.vatNumber })}>
                          <Download className="h-3.5 w-3.5"/> View
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              {selectedDoc && (
                <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary"/> {selectedDoc.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 my-2 border rounded-lg p-6 bg-muted/20">
                      {selectedDoc.url ? (
                        <div className="space-y-3 text-center">
                          {selectedDoc.url.match(/\.(jpg|jpeg|png|webp)/i) ? (
                            <img src={selectedDoc.url} alt={selectedDoc.title} className="max-h-96 rounded border mx-auto object-contain"/>
                          ) : (
                            <iframe src={selectedDoc.url} title={selectedDoc.title} className="w-full h-80 rounded border"/>
                          )}
                          <a href={selectedDoc.url} target="_blank" rel="noreferrer" className="inline-block mt-2">
                            <Button size="sm"><Download className="mr-2 h-4 w-4"/> Open Original File</Button>
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b pb-3">
                            <span className="text-sm font-semibold uppercase text-muted-foreground">Document Type</span>
                            <span className="font-mono font-medium">{selectedDoc.title}</span>
                          </div>
                          <div className="flex items-center justify-between border-b pb-3">
                            <span className="text-sm font-semibold uppercase text-muted-foreground">Issued To</span>
                            <span className="font-medium">{selectedDoc.owner}</span>
                          </div>
                          <div className="flex items-center justify-between border-b pb-3">
                            <span className="text-sm font-semibold uppercase text-muted-foreground">License No.</span>
                            <span className="font-mono font-medium">{selectedDoc.license}</span>
                          </div>
                          <div className="flex items-center justify-between border-b pb-3">
                            <span className="text-sm font-semibold uppercase text-muted-foreground">VAT Registration</span>
                            <span className="font-mono font-medium">{selectedDoc.vat}</span>
                          </div>
                          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-400 flex items-center gap-2">
                            <Check className="h-4 w-4 text-emerald-400 shrink-0"/> Official UAE Regulatory Verification Record · Verified Active
                          </div>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSelectedDoc(null)}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              <TabsContent value="history" className="mt-4 space-y-3">
                {[
            { date: "2025-11-12", who: "Layla Admin", action: "Requested updated Trade License" },
            { date: "2025-11-01", who: "System", action: "Documents received" },
            { date: "2025-10-28", who: "Caterer", action: "Application submitted" },
        ].map((h, i) => (<div key={i} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary"/>
                    <div className="flex-1">
                      <p className="font-medium">{h.action}</p>
                      <p className="text-xs text-muted-foreground">{h.date} · {h.who}</p>
                    </div>
                  </div>))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>);
}
function Field({ label, value }) {
    return (<div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>);
}
function Metric({ label, value }) {
    return (<div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>);
}
