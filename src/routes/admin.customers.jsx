import { Outlet, createFileRoute, Link, useMatch } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Eye } from "lucide-react";
export const Route = createFileRoute("/admin/customers")({
    component: CustomersPage,
});
function CustomersPage() {
    const matchChild = useMatch({ from: "/admin/customers/$id", shouldThrow: false });
    const { data: usersList = [], isLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: () => apiRequest("/api/v1/users"),
    });

    if (matchChild) {
        return <Outlet />;
    }

    const mappedUsers = usersList.map((u) => ({
        id: `CU-${u.id}`,
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
            header: "",
            render: (r) => (<Button asChild variant="ghost" size="sm">
          <Link to="/admin/customers/$id" params={{ id: r.id }}>
            <Eye className="mr-1 h-4 w-4"/> View
          </Link>
        </Button>),
        },
    ];
    return (<>
      <PageHeader title="Customers" description="Manage marketplace customers and their activity."/>
      <div className="p-6">
        <DataTable data={mappedUsers} columns={columns} searchKeys={["name", "email", "id"]}/>
      </div>
    </>);
}
