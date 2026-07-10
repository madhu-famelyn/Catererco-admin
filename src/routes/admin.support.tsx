import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supportTickets } from "@/lib/mock-data";
import { Eye } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/support")({
  component: SupportPage,
});

const priorityStyle: Record<string, string> = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  medium: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  urgent: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
};

function SupportPage() {
  const [type, setType] = useState("all");
  const filtered = type === "all" ? supportTickets : supportTickets.filter((t) => t.type === type);
  const columns: Column<(typeof supportTickets)[number]>[] = [
    { key: "id", header: "Ticket" },
    { key: "subject", header: "Subject" },
    { key: "from", header: "From" },
    { key: "type", header: "Type", render: (r) => <Badge variant="outline" className="capitalize">{r.type}</Badge> },
    { key: "priority", header: "Priority", render: (r) => <Badge className={priorityStyle[r.priority] + " border-transparent capitalize"}>{r.priority}</Badge> },
    { key: "assignee", header: "Assignee" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "createdAt", header: "Created" },
    {
      key: "actions", header: "",
      render: (r) => (
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin/support/$id" params={{ id: r.id }}><Eye className="mr-1 h-4 w-4" /> Open</Link>
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Support Tickets" description="Manage customer and caterer queries." />
      <div className="p-6">
        <DataTable
          data={filtered}
          columns={columns}
          searchKeys={["id", "subject", "from", "assignee"]}
          toolbar={
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="caterer">Caterer</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      </div>
    </>
  );
}
