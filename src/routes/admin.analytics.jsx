import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend, } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { customerGrowth, popularEventTypes, popularCuisines } from "@/lib/mock-data";

import { toast } from "sonner";

export const Route = createFileRoute("/admin/analytics")({
    component: AnalyticsPage,
});
const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#0ea5e9", "#a855f7"];
function AnalyticsPage() {
    const { data: apiDashboard } = useQuery({
        queryKey: ["admin-dashboard-analytics"],
        queryFn: async () => {
            try {
                const res = await fetch("http://localhost:8000/dashboard/admin");
                if (res.ok) return await res.json();
            } catch (e) {}
            return null;
        },
        refetchInterval: 5000,
    });

    const { data: caterersList = [] } = useQuery({
        queryKey: ["admin-caterers-analytics"],
        queryFn: async () => {
            try {
                const res = await fetch("http://localhost:8000/caterers?include_unverified=true");
                if (res.ok) return await res.json();
            } catch (e) {}
            return [];
        },
    });

    const liveRevenueOverview = apiDashboard?.revenueOverview || [];
    const liveBookingTrends = apiDashboard?.bookingTrends || [];
    const topCaterers = caterersList.map((c) => ({
        id: c.id,
        name: c.name || "Caterer",
        city: c.emirate || "Dubai",
        bookings: c.bookings ?? 0,
        revenue: c.revenue ?? 0,
        rating: c.rating ?? 5.0,
    })).sort((a, b) => b.revenue - a.revenue);

    const handleExportReport = () => {
        const headers = ["Section", "Metric_Or_Name", "Value_Or_Bookings", "Extra_Info_Or_Revenue"];
        const rows = [
            ...liveRevenueOverview.map((r) => ["Monthly Revenue", r.month, `AED ${r.revenue}`, `Commission: AED ${r.commission || 0}`]),
            ...liveBookingTrends.map((b) => ["Booking Trends", b.month, `${b.bookings} Bookings`, "-"]),
            ...customerGrowth.map((g) => ["Customer Growth", g.month, `${g.customers} Customers`, "-"]),
            ...topCaterers.map((c) => ["Top Caterer", `"${c.name.replace(/"/g, '""')}"`, `${c.bookings} Bookings`, `AED ${c.revenue}`]),
        ];

        const csvString = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `marketplace_analytics_report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Analytics Report CSV exported successfully!");
    };

    return (<>
      <PageHeader title="Analytics" description="Revenue, growth and marketplace performance." actions={<Button variant="outline" onClick={handleExportReport}><Download className="mr-2 h-4 w-4"/> Export Report</Button>}/>
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer>
                <AreaChart data={liveRevenueOverview}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                  <XAxis dataKey="month" fontSize={12}/>
                  <YAxis fontSize={12}/>
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Booking Trends</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={liveBookingTrends}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                  <XAxis dataKey="month" fontSize={12}/>
                  <YAxis fontSize={12}/>
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#0ea5e9" radius={[6, 6, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Customer Growth</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={customerGrowth}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                  <XAxis dataKey="month" fontSize={12}/>
                  <YAxis fontSize={12}/>
                  <Tooltip />
                  <Line type="monotone" dataKey="customers" stroke="#ec4899" strokeWidth={2}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Popular Event Types</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={popularEventTypes} dataKey="value" nameKey="name" outerRadius={90} label>
                    {popularEventTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Popular Cuisines</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={popularCuisines} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                  <XAxis type="number" fontSize={12}/>
                  <YAxis dataKey="name" type="category" fontSize={12} width={100}/>
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" radius={[0, 6, 6, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Top Performing Caterers</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr><th className="pb-3">Caterer</th><th>City</th><th>Bookings</th><th>Revenue</th><th>Rating</th></tr>
                </thead>
                <tbody className="divide-y">
                  {topCaterers.map((c) => (<tr key={c.id}>
                      <td className="py-3 font-medium">{c.name}</td>
                      <td>{c.city}</td>
                      <td>{c.bookings}</td>
                      <td>AED {c.revenue.toLocaleString()}</td>
                      <td>⭐ {c.rating}</td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>);
}
