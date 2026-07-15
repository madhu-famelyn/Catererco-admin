import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, ArrowDownToLine } from "lucide-react";
import { payments, settlements, refunds } from "@/lib/mock-data";
import { toast } from "sonner";
export const Route = createFileRoute("/admin/payments")({
    component: PaymentsPage,
});
function PaymentsPage() {
    const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
    const totalCommission = payments.reduce((s, p) => s + p.commission, 0);
    const pendingPayouts = settlements.filter((s) => s.status === "pending").reduce((s, x) => s + x.net, 0);
    const paymentCols = [
        { key: "id", header: "Payment" },
        { key: "bookingId", header: "Booking" },
        { key: "customer", header: "Customer" },
        { key: "caterer", header: "Caterer" },
        { key: "amount", header: "Amount", render: (r) => `AED ${r.amount.toLocaleString()}` },
        { key: "commission", header: "Commission", render: (r) => `AED ${r.commission.toLocaleString()}` },
        { key: "method", header: "Method" },
        { key: "date", header: "Date" },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status}/> },
    ];
    const settlementCols = [
        { key: "id", header: "Settlement" },
        { key: "caterer", header: "Caterer" },
        { key: "period", header: "Period" },
        { key: "gross", header: "Gross", render: (r) => `AED ${r.gross.toLocaleString()}` },
        { key: "commission", header: "Commission", render: (r) => `AED ${r.commission.toLocaleString()}` },
        { key: "net", header: "Net Payout", render: (r) => `AED ${r.net.toLocaleString()}` },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status}/> },
        {
            key: "actions", header: "",
            render: (r) => r.status === "pending" ? (<Button size="sm" onClick={() => toast.success(`Payout ${r.id} released`)}>Release payout</Button>) : <span className="text-xs text-muted-foreground">Released</span>,
        },
    ];
    const refundCols = [
        { key: "id", header: "Refund" },
        { key: "bookingId", header: "Booking" },
        { key: "customer", header: "Customer" },
        { key: "amount", header: "Amount", render: (r) => `AED ${r.amount.toLocaleString()}` },
        { key: "reason", header: "Reason" },
        { key: "date", header: "Date" },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status}/> },
        {
            key: "actions", header: "",
            render: (r) => r.status === "pending" ? (<div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => toast.error("Refund rejected")}>Reject</Button>
          <Button size="sm" onClick={() => toast.success("Refund approved")}>Approve</Button>
        </div>) : null,
        },
    ];
    return (<>
      <PageHeader title="Payments" description="Track commissions, settlements, refunds and payouts."/>
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total Payments" value={`AED ${totalRevenue.toLocaleString()}`} icon={Wallet}/>
          <StatCard label="Commission Earned" value={`AED ${totalCommission.toLocaleString()}`} icon={TrendingUp}/>
          <StatCard label="Pending Payouts" value={`AED ${pendingPayouts.toLocaleString()}`} icon={ArrowDownToLine}/>
        </div>

        <Card>
          <CardHeader><CardTitle>Transactions</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="settlements">Settlements</TabsTrigger>
                <TabsTrigger value="refunds">Refunds</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <DataTable data={payments} columns={paymentCols} searchKeys={["id", "customer", "caterer", "bookingId"]}/>
              </TabsContent>
              <TabsContent value="settlements" className="mt-4">
                <DataTable data={settlements} columns={settlementCols} searchKeys={["id", "caterer"]}/>
              </TabsContent>
              <TabsContent value="refunds" className="mt-4">
                <DataTable data={refunds} columns={refundCols} searchKeys={["id", "customer", "bookingId"]}/>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>);
}
