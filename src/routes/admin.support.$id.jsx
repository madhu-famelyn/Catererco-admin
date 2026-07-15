import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supportTickets, adminUsers } from "@/lib/mock-data";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
export const Route = createFileRoute("/admin/support/$id")({
    component: TicketDetail,
});
function TicketDetail() {
    const { id } = Route.useParams();
    const t = supportTickets.find((x) => x.id === id) ?? supportTickets[0];
    return (<>
      <PageHeader title={t.subject} description={`Ticket ${t.id} · from ${t.from}`} actions={<>
            <Button variant="outline" asChild><Link to="/admin/support"><ArrowLeft className="mr-2 h-4 w-4"/> Back</Link></Button>
            <Button onClick={() => toast.success("Ticket resolved")}><CheckCircle2 className="mr-2 h-4 w-4"/> Mark Resolved</Button>
          </>}/>
      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Conversation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Message from={t.from} time={t.createdAt} text="Hi, I need help with my booking. The caterer hasn't confirmed yet."/>
            <Message from="Layla Admin" time={t.createdAt} text="Thanks for reaching out. Looking into this now." mine/>
            <div className="space-y-2 pt-4">
              <Label>Reply</Label>
              <Textarea rows={4} placeholder="Type your reply..."/>
              <div className="flex justify-end">
                <Button><Send className="mr-2 h-4 w-4"/> Send</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Ticket Info</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Row label="Status" value={<StatusBadge status={t.status}/>}/>
            <Row label="Priority" value={<span className="capitalize">{t.priority}</span>}/>
            <Row label="Type" value={<span className="capitalize">{t.type}</span>}/>
            <Row label="Created" value={t.createdAt}/>
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select defaultValue={t.assignee}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unassigned">Unassigned</SelectItem>
                  {adminUsers.map((a) => <SelectItem key={a.id} value={a.name}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </>);
}
function Message({ from, time, text, mine }) {
    return (<div className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
      <div className={`max-w-md rounded-lg p-3 ${mine ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        <p className="text-sm">{text}</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{from} · {time}</p>
    </div>);
}
function Row({ label, value }) {
    return <div className="flex items-center justify-between"><span className="text-muted-foreground">{label}</span><span>{value}</span></div>;
}
