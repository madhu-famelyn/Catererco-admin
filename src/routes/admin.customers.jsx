import { Outlet, createFileRoute, Link, useMatch } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({
    component: CustomersPage,
});
function CustomersPage() {
    const queryClient = useQueryClient();
    const matchChild = useMatch({ from: "/admin/customers/$id", shouldThrow: false });
    const { data: usersList = [], isLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            try {
                const res = await fetch("http://localhost:8000/users");
                if (res.ok) return await res.json();
            } catch (e) {}
            return [];
        },
        refetchInterval: 5000,
    });

    if (matchChild) {
        return <Outlet />;
    }

    const handleDeleteUser = async (rawId, name) => {
        const numericId = String(rawId).replace("CU-", "");
        if (!confirm(`Are you sure you want to delete customer account "${name}"?`)) return;
        try {
            await fetch(`http://localhost:8000/users/${numericId}`, { method: "DELETE" });
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
            toast.success(`Customer "${name}" deleted successfully`);
        } catch (e) {
            toast.error("Failed to delete customer account");
        }
    };

    const mappedUsers = usersList.map((u) => ({
        id: `CU-${u.id}`,
        rawId: u.id,
        name: `${u.first_name} ${u.last_name}`,
        email: u.email,
        city: u.preferred_emirate || "Dubai",
        totalBookings: u.bookings_count ?? 0,
        totalSpent: u.total_spent ?? 0,
        status: u.is_verified ? "active" : "pending",
    }));
    const columns = [
        { key: "id", header: "ID" },
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        { key: "city", header: "City" },
        { key: "totalBookings", header: "Bookings" },
        { key: "totalSpent", header: "Spent", render: (r) => `AED ${r.totalSpent.toLocaleString()}` },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status}/> },
        {
            key: "actions",
            header: "Actions",
            className: "text-right pr-6 w-48",
            render: (r) => (<div className="flex items-center justify-end gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/customers/$id" params={{ id: r.id }}>
              <Eye className="mr-1 h-4 w-4"/> View
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600" onClick={() => handleDeleteUser(r.id, r.name)}>
            <Trash2 className="h-3.5 w-3.5 mr-1"/> Delete
          </Button>
        </div>),
        },
    ];
    return (<>
      <PageHeader title="Customers" description="Manage marketplace customers and their activity."/>
      <div className="p-6">
        <DataTable data={mappedUsers} columns={columns} searchKeys={["name", "email", "id"]}/>
      </div>
    </>);
}
