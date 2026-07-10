import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Eye, Download } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/caterers")({
  component: CaterersPage,
});

function CaterersPage() {
  const [status, setStatus] = useState("all");

  const { data: caterersList = [], isLoading } = useQuery({
    queryKey: ["admin-caterers"],
    queryFn: () => apiRequest<any[]>("/api/v1/caterers"),
  });

  const mappedCaterers = caterersList.map((c) => ({
    id: c.id,
    name: c.name || c.business_name,
    owner: c.owner_name || "N/A",
    city: c.location || c.city || "Dubai",
    tradeLicense: c.trade_license || "N/A",
    bookings: c.bookings ?? 0,
    revenue: c.revenue ?? 0,
    status: c.is_verified ? "approved" : "pending",
  }));

  const filtered = status === "all" ? mappedCaterers : mappedCaterers.filter((c) => c.status === status);

  const columns: Column<(typeof mappedCaterers)[number]>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Business" },
    { key: "owner", header: "Owner" },
    { key: "city", header: "City" },
    { key: "tradeLicense", header: "Trade License" },
    { key: "bookings", header: "Bookings" },
    { key: "revenue", header: "Revenue", render: (r) => `AED ${r.revenue.toLocaleString()}` },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin/caterers/$id" params={{ id: r.id }}>
            <Eye className="mr-1 h-4 w-4" /> View
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Caterer Verification"
        description="Review applications, verify licenses and approve caterers."
        actions={<Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>}
      />
      <div className="p-6">
        <DataTable
          data={filtered}
          columns={columns}
          searchKeys={["name", "owner", "email", "id", "tradeLicense"]}
          toolbar={
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      </div>
    </>
  );
}
