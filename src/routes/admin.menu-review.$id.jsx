import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Check, X, RefreshCw, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/admin/menu-review/$id")({
    component: MenuReviewDetail,
});

function MenuReviewDetail() {
    const { id } = Route.useParams();
    const { data: caterersList = [] } = useQuery({
        queryKey: ["admin-menu-review-caterers"],
        queryFn: async () => {
            try {
                const res = await fetch("http://localhost:8000/caterers?include_unverified=true");
                if (res.ok) return await res.json();
            } catch (e) {}
            return [];
        },
    });

    const currentCaterer = caterersList[0] || { name: "Live Caterer", is_verified: false, created_at: "2026-07-16" };

    const review = {
        id,
        caterer: currentCaterer.name || "Caterer Profile",
        uploadedAt: currentCaterer.created_at ? new Date(currentCaterer.created_at).toISOString().slice(0, 10) : "2026-07-16",
        itemsExtracted: 6,
        confidence: 96,
        status: currentCaterer.is_verified ? "approved" : "pending",
    };

    const [items, setItems] = useState([
        { id: "1", name: "Royal Biryani Combo", category: "Mains", price: 85 },
        { id: "2", name: "Arabic Mezze Platter", category: "Starters", price: 45 },
        { id: "3", name: "Grilled Lamb Chops", category: "Mains", price: 110 },
        { id: "4", name: "Saffron Kheer", category: "Desserts", price: 25 },
    ]);
    const [status, setStatus] = useState(review.status);

    const handleApprove = () => {
        setStatus("approved");
        toast.success(`Menu for ${review.caterer} approved and published live!`);
    };

    const handleReject = () => {
        setStatus("rejected");
        toast.error(`Menu for ${review.caterer} rejected.`);
    };

    return (<>
      <PageHeader title={`Menu Review · ${review.caterer}`} description={`${review.itemsExtracted} items extracted · ${review.confidence}% confidence`} actions={<>
            <Button variant="outline" asChild><Link to="/admin/menu-review"><ArrowLeft className="mr-2 h-4 w-4"/> Back</Link></Button>
            <Button variant="outline" onClick={() => toast("Reprocessing menu...")}><RefreshCw className="mr-2 h-4 w-4"/> Reprocess</Button>
            <Button variant="destructive" onClick={handleReject} disabled={status === "rejected"}><X className="mr-2 h-4 w-4"/> Reject</Button>
            <Button onClick={handleApprove} disabled={status === "approved"} className={status === "approved" ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}>
              <Check className="mr-2 h-4 w-4"/> {status === "approved" ? "Approved" : "Approve"}
            </Button>
          </>}/>
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Uploaded Menu</CardTitle>
            <StatusBadge status={status}/>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 text-muted-foreground">
              <FileText className="mb-2 h-10 w-10"/>
              <p className="text-sm">menu.pdf preview</p>
              <p className="text-xs">Uploaded {review.uploadedAt}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary"/> AI Extracted Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead><TableHead>Category</TableHead><TableHead className="w-28">Price (AED)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it, i) => (<TableRow key={it.id}>
                    <TableCell>
                      <Input value={it.name} onChange={(e) => {
                const next = [...items];
                next[i] = { ...it, name: e.target.value };
                setItems(next);
            }}/>
                    </TableCell>
                    <TableCell>
                      <Input value={it.category} onChange={(e) => {
                const next = [...items];
                next[i] = { ...it, category: e.target.value };
                setItems(next);
            }}/>
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={it.price} onChange={(e) => {
                const next = [...items];
                next[i] = { ...it, price: Number(e.target.value) };
                setItems(next);
            }}/>
                    </TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>);
}
