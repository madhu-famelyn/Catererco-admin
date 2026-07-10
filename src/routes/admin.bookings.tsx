import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bookings } from "@/lib/mock-data";
import { Eye } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/bookings")({
  component: BookingsPage,
});

function BookingsPage() {
  const [status, setStatus] = useState("all");
  const filtered = status === "all" ? bookings : bookings.filter((b) => b.status === status);

  const columns: Column<(typeof bookings)[number]>[] = [
    { key: "id", header: "Booking" },
    { key: "customer", header: "Customer" },
    { key: "caterer", header: "Caterer" },
    { key: "eventType", header: "Event" },
    { key: "eventDate", header: "Date" },
    { key: "guests", header: "Guests" },
    { key: "amount", header: "Amount", render: (r) => `AED ${r.amount.toLocaleString()}` },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin/bookings/$id" params={{ id: r.id }}>
            <Eye className="mr-1 h-4 w-4" /> View
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Bookings" description="Track every booking across the marketplace." />
      <div className="p-6">
        <DataTable
          data={filtered}
          columns={columns}
          searchKeys={["id", "customer", "caterer", "eventType"]}
          toolbar={
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      </div>
    </>
  );
}
