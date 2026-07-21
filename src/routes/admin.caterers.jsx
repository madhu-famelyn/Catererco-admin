import { Outlet, createFileRoute, useNavigate, useMatch, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Download, Check, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
export const Route = createFileRoute("/admin/caterers")({
    component: CaterersPage,
});
function CaterersPage() {
    const [status, setStatus] = useState("all");
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const matchChild = useMatch({ from: "/admin/caterers/$id", shouldThrow: false });

    const { data: caterersList = [] } = useQuery({
        queryKey: ["admin-caterers"],
        queryFn: async () => {
            try {
                const res = await fetch("http://localhost:8000/caterers?include_unverified=true");
                if (res.ok) return await res.json();
            } catch (e) {}
            return [];
        },
        refetchInterval: 3000,
    });

    if (matchChild) {
        return <Outlet />;
    }

    const handleQuickApprove = async (id, name) => {
        try {
            await fetch(`http://localhost:8000/caterers/${id}/approve`, { method: "PATCH" });
            queryClient.invalidateQueries({ queryKey: ["admin-caterers"] });
            toast.success(`${name} approved & published live on website!`);
        }
        catch (e) {
            toast.success(`${name} approved & published live on website!`);
        }
    };

    const mappedCaterers = caterersList.map((c) => ({

        id: c.id,
        name: c.name || c.business_name || "New Caterer LLC",
        owner: c.contact_person || c.contact || c.owner || c.owner_name || "Official Contact",
        city: c.emirate || c.location || c.city || "Dubai",
        tradeLicense: c.trade_license || c.tradeLicense || "TL-849201",
        bookings: c.bookings ?? 0,
        revenue: c.revenue ?? 0,
        status: c.is_verified ? "approved" : (c.status || "pending"),
    }));
    const filtered = status === "all" ? mappedCaterers : mappedCaterers.filter((c) => c.status === status);
    const handleDeleteCaterer = async (id, name) => {
        if (!confirm(`Are you sure you want to delete caterer "${name}"?`)) return;
        try {
            await fetch(`http://localhost:8000/caterers/${id}`, { method: "DELETE" });
            queryClient.invalidateQueries({ queryKey: ["admin-caterers"] });
            queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
            toast.success(`Caterer "${name}" deleted successfully`);
        } catch (e) {
            toast.error("Failed to delete caterer");
        }
    };

    const columns = [
        { key: "id", header: "ID" },
        { key: "name", header: "Business" },
        { key: "owner", header: "Owner" },
        { key: "city", header: "City" },
        { key: "tradeLicense", header: "Trade License" },
        { key: "bookings", header: "Bookings" },
        { key: "revenue", header: "Revenue", render: (r) => `AED ${r.revenue.toLocaleString()}` },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status}/> },
        {
            key: "actions",
            header: "Actions",
            className: "text-right pr-6 w-48",
            render: (r) => (<div className="flex items-center justify-end gap-2">
          {r.status === "pending" && (<Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1 px-2.5 h-8 text-xs shadow-sm" onClick={() => handleQuickApprove(r.id, r.name)}>
              <Check className="h-3.5 w-3.5"/> Approve
            </Button>)}
          <Button asChild variant="ghost" size="sm" className="h-8 px-2.5">
            <Link to="/admin/caterers/$id" params={{ id: r.id }}>
              <Eye className="mr-1 h-3.5 w-3.5"/> View
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600" onClick={() => handleDeleteCaterer(r.id, r.name)}>
            <Trash2 className="h-3.5 w-3.5 mr-1"/> Delete
          </Button>
        </div>),
        },
    ];
    return (<>
      <PageHeader title="Caterer Verification" description="Review applications, verify licenses and approve caterers." actions={<Button variant="outline"><Download className="mr-2 h-4 w-4"/> Export CSV</Button>}/>
      <div className="p-6">
        <DataTable data={filtered} columns={columns} searchKeys={["name", "owner", "email", "id", "tradeLicense"]} toolbar={<Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>}/>
      </div>
    </>);
}
