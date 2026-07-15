import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ImageIcon, Flag, Check, X } from "lucide-react";
import { reviews } from "@/lib/mock-data";
import { toast } from "sonner";
export const Route = createFileRoute("/admin/reviews")({
    component: ReviewsPage,
});
function ReviewsPage() {
    const filters = {
        all: reviews,
        caterer: reviews.filter((r) => r.targetType === "caterer"),
        customer: reviews.filter((r) => r.targetType === "customer"),
        reported: reviews.filter((r) => r.reported),
    };
    return (<>
      <PageHeader title="Review Moderation" description="Approve, remove or investigate reported reviews."/>
      <div className="p-6">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({filters.all.length})</TabsTrigger>
            <TabsTrigger value="caterer">Caterer Reviews ({filters.caterer.length})</TabsTrigger>
            <TabsTrigger value="customer">Customer Reviews ({filters.customer.length})</TabsTrigger>
            <TabsTrigger value="reported">Reported ({filters.reported.length})</TabsTrigger>
          </TabsList>
          {Object.keys(filters).map((k) => (<TabsContent key={k} value={k} className="mt-4 grid gap-3 md:grid-cols-2">
              {filters[k].map((r) => (<Card key={r.id}>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{r.author}</p>
                        <p className="text-xs text-muted-foreground">
                          on <span className="font-medium text-foreground">{r.target}</span> · {r.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}/>))}
                      </div>
                    </div>
                    <p className="text-sm">{r.content}</p>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={r.status}/>
                      {r.images > 0 && <Badge variant="outline"><ImageIcon className="mr-1 h-3 w-3"/> {r.images} photos</Badge>}
                      {r.reported && <Badge variant="destructive"><Flag className="mr-1 h-3 w-3"/> Reported</Badge>}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.error("Review removed")}><X className="mr-1 h-4 w-4"/> Remove</Button>
                      <Button size="sm" onClick={() => toast.success("Review approved")}><Check className="mr-1 h-4 w-4"/> Approve</Button>
                    </div>
                  </CardContent>
                </Card>))}
            </TabsContent>))}
        </Tabs>
      </div>
    </>);
}
