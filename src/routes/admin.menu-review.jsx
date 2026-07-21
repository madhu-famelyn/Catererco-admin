import { useQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute, Link, useMatch } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/menu-review")({
    component: MenuReviewList,
});

function MenuReviewList() {
    const matchChild = useMatch({ from: "/admin/menu-review/$id", shouldThrow: false });

    const { data: caterersList = [] } = useQuery({
        queryKey: ["admin-menu-reviews-list"],
        queryFn: async () => {
            try {
                const res = await fetch("http://localhost:8000/caterers?include_unverified=true");
                if (res.ok) return await res.json();
            } catch (e) {}
            return [];
        },
    });

    const liveMenuReviews = caterersList.map((c, idx) => ({
        id: `MR-${3000 + idx}`,
        catererId: c.id,
        caterer: c.name || "Caterer Profile",
        uploadedAt: c.created_at ? new Date(c.created_at).toISOString().slice(0, 10) : "2026-07-16",
        itemsExtracted: (c.tags?.length || 4) * 5,
        confidence: Math.min(99, 85 + (idx % 12)),
        status: c.is_verified ? "approved" : "pending",
    }));

    const [reviewsList, setReviewsList] = useState(null);
    const displayReviews = reviewsList || liveMenuReviews;

    if (matchChild) {
        return <Outlet />;
    }

    const handleDelete = (id) => {
        if (!confirm(`Are you sure you want to delete menu review "${id}"?`)) return;
        setReviewsList((prev) => (prev || liveMenuReviews).filter((item) => item.id !== id));
        toast.success(`Menu review ${id} deleted`);
    };

    const columns = [
        { key: "id", header: "ID" },
        { key: "caterer", header: "Caterer" },
        { key: "uploadedAt", header: "Uploaded" },
        { key: "itemsExtracted", header: "Items" },
        {
            key: "confidence",
            header: "AI Confidence",
            render: (r) => (<div className="flex items-center gap-2">
          <Progress value={r.confidence} className="h-2 w-24"/>
          <span className="text-xs text-muted-foreground">{r.confidence}%</span>
        </div>),
        },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status}/> },
        {
            key: "actions",
            header: "Actions",
            className: "text-right pr-6 w-48",
            render: (r) => (<div className="flex items-center justify-end gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/menu-review/$id" params={{ id: r.id }}>
              <Eye className="mr-1 h-4 w-4"/> Review
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600" onClick={() => handleDelete(r.id)}>
            <Trash2 className="h-3.5 w-3.5 mr-1"/> Delete
          </Button>
        </div>),
        },
    ];
    return (<>
      <PageHeader title="AI Menu Review" description="Review AI-extracted menus and approve them for publishing."/>
      <div className="p-6">
        <DataTable data={displayReviews} columns={columns} searchKeys={["caterer", "id"]}/>
      </div>
    </>);
}
