import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { customers, bookings, refunds } from "@/lib/mock-data";
import { ArrowLeft, Ban, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/customers/$id")({
  component: CustomerDetail,
});

function CustomerDetail() {
  const { id } = useParams({ from: "/admin/customers/$id" });
  const c = customers.find((x) => x.id === id) ?? customers[0];
  const custBookings = bookings.filter((b) => b.customerId === c.id).slice(0, 6);
  const custRefunds = refunds.slice(0, 4);
  const suspended = c.status === "suspended";

  return (
    <>
      <PageHeader
        title={c.name}
        description={c.email}
        actions={
          <>
            <Button variant="outline" asChild><Link to="/admin/customers"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link></Button>
            {suspended ? (
              <Button onClick={() => toast.success("Customer reactivated")}><RotateCcw className="mr-2 h-4 w-4" /> Reactivate</Button>
            ) : (
              <Button variant="destructive" onClick={() => toast.error("Customer suspended")}><Ban className="mr-2 h-4 w-4" /> Suspend</Button>
            )}
          </>
        }
      />
      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profile</CardTitle>
              <StatusBadge status={c.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Phone:</span> {c.phone}</p>
            <p><span className="text-muted-foreground">City:</span> {c.city}</p>
            <p><span className="text-muted-foreground">Joined:</span> {c.joinedAt}</p>
            <p><span className="text-muted-foreground">Total spent:</span> AED {c.totalSpent.toLocaleString()}</p>
            <p><span className="text-muted-foreground">Total bookings:</span> {c.totalBookings}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="bookings">
              <TabsList>
                <TabsTrigger value="bookings">Booking History</TabsTrigger>
                <TabsTrigger value="quotations">Saved Quotations</TabsTrigger>
                <TabsTrigger value="disputes">Disputes</TabsTrigger>
                <TabsTrigger value="refunds">Refunds</TabsTrigger>
              </TabsList>
              <TabsContent value="bookings" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead><TableHead>Caterer</TableHead><TableHead>Event</TableHead>
                      <TableHead>Amount</TableHead><TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {custBookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell>{b.id}</TableCell><TableCell>{b.caterer}</TableCell>
                        <TableCell>{b.eventType}</TableCell><TableCell>AED {b.amount.toLocaleString()}</TableCell>
                        <TableCell><StatusBadge status={b.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="quotations" className="mt-4 text-sm text-muted-foreground">
                <p>3 saved quotations. Latest for a corporate event on 2026-02-14.</p>
              </TabsContent>
              <TabsContent value="disputes" className="mt-4 text-sm text-muted-foreground">
                <p>No open disputes.</p>
              </TabsContent>
              <TabsContent value="refunds" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>ID</TableHead><TableHead>Amount</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {custRefunds.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.id}</TableCell><TableCell>AED {r.amount.toLocaleString()}</TableCell>
                        <TableCell>{r.reason}</TableCell><TableCell><StatusBadge status={r.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
