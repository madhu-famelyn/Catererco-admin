import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { menuReviews } from "@/lib/mock-data";
import { Eye } from "lucide-react";

export const Route = createFileRoute("/admin/menu-review")({
  component: MenuReviewList,
});

function MenuReviewList() {
  const columns: Column<(typeof menuReviews)[number]>[] = [
    { key: "id", header: "ID" },
    { key: "caterer", header: "Caterer" },
    { key: "uploadedAt", header: "Uploaded" },
    { key: "itemsExtracted", header: "Items" },
    {
      key: "confidence",
      header: "AI Confidence",
      render: (r) => (
        <div className="flex items-center gap-2">
          <Progress value={r.confidence} className="h-2 w-24" />
          <span className="text-xs text-muted-foreground">{r.confidence}%</span>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin/menu-review/$id" params={{ id: r.id }}>
            <Eye className="mr-1 h-4 w-4" /> Review
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="AI Menu Review" description="Review AI-extracted menus and approve them for publishing." />
      <div className="p-6">
        <DataTable data={menuReviews} columns={columns} searchKeys={["caterer", "id"]} />
      </div>
    </>
  );
}
