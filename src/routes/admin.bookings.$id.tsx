import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { bookings } from "@/lib/mock-data";
import { ArrowLeft, XCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/bookings/$id")({
  component: BookingDetail,
});

const timeline = [
  { date: "2025-11-01 09:12", label: "Booking created" },
  { date: "2025-11-01 10:04", label: "Deposit paid" },
  { date: "2025-11-02 14:20", label: "Caterer confirmed" },
  { date: "2025-11-15 08:00", label: "Menu finalized" },
  { date: "Event day", label: "Service delivered" },
];

function BookingDetail() {
  const { id } = useParams({ from: "/admin/bookings/$id" });
  const b = bookings.find((x) => x.id === id) ?? bookings[0];

  return (
    <>
      <PageHeader
        title={`Booking ${b.id}`}
        description={`${b.eventType} · ${b.eventDate}`}
        actions={
          <>
            <Button variant="outline" asChild><Link to="/admin/bookings"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link></Button>
            <Button variant="outline" onClick={() => toast("Dispute resolution initiated")}><ShieldAlert className="mr-2 h-4 w-4" /> Resolve Dispute</Button>
            <Button variant="destructive" onClick={() => toast.error("Booking cancelled")}><XCircle className="mr-2 h-4 w-4" /> Cancel Booking</Button>
          </>
        }
      />
      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Overview</CardTitle>
            <StatusBadge status={b.status} />
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Event type" value={b.eventType} />
            <Row label="Event date" value={b.eventDate} />
            <Row label="Guests" value={b.guests.toString()} />
            <Row label="Amount" value={`AED ${b.amount.toLocaleString()}`} />
            <Row label="Commission" value={`AED ${Math.floor(b.amount * 0.1).toLocaleString()}`} />
            <Row label="Created" value={b.createdAt} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">{b.customer}</p>
            <p className="text-muted-foreground">{b.customerId}</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/customers/$id" params={{ id: b.customerId }}>View profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Assigned Caterer</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">{b.caterer}</p>
            <p className="text-muted-foreground">{b.catererId}</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/caterers/$id" params={{ id: b.catererId }}>View profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
          <CardContent>
            <ol className="relative space-y-4 border-l pl-6">
              {timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-primary" />
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.date}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b py-1 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
