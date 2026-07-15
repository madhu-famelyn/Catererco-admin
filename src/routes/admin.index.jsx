import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Wallet, ChefHat, Users, ClipboardCheck, Sparkles, LifeBuoy, ArrowRight, Plus, Download, } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { bookings, revenueOverview, bookingTrends } from "@/lib/mock-data";
export const Route = createFileRoute("/admin/")({
    component: DashboardPage,
});
function DashboardPage() {
    const { data: apiDashboard } = useQuery({
        queryKey: ["admin-dashboard-stats"],
        queryFn: async () => {
            if (typeof window === "undefined")
                return null;
            try {
                const res = await fetch("http://localhost:8000/dashboard/admin");
                if (res.ok)
                    return await res.json();
            }
            catch (e) { }
            return null;
        },
        refetchInterval: 3000,
    });
    const stats = apiDashboard?.stats || {
        totalBookings: 4,
        totalRevenue: 60248,
        activeCaterers: 6,
        activeCustomers: 12,
        pendingCatererApprovals: 0,
        pendingMenuReviews: 2,
        openSupportTickets: 0,
    };
    return (<>
      <PageHeader title="Dashboard" description="Snapshot of your marketplace performance." actions={<>
            <Button variant="outline" className="border-white/10 bg-white/[0.02] hover:bg-white/[0.06]">
              <Download className="mr-2 h-4 w-4"/> Export
            </Button>
            <Button className="shadow-[0_0_30px_-6px_var(--color-primary)]">
              <Plus className="mr-2 h-4 w-4"/> New announcement
            </Button>
          </>}/>
      <div className="space-y-6 p-6">
        {/* Bento KPI grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Bookings" value={stats.totalBookings.toLocaleString()} icon={CalendarCheck} trend="Live Database Count" spark={bookingTrends.map((b) => b.bookings)}/>
          <StatCard label="Total Revenue" value={`AED ${stats.totalRevenue.toLocaleString()}`} icon={Wallet} trend="Live Revenue Sum" spark={revenueOverview.map((r) => r.revenue)} accent="emerald"/>
          <StatCard label="Active Caterers" value={stats.activeCaterers} icon={ChefHat} trend="Verified Active Caterers" spark={[2, 3, 4, 5, 6, 6, 6, 6]} accent="amber"/>
          <StatCard label="Active Customers" value={stats.activeCustomers.toLocaleString()} icon={Users} trend="Registered Accounts" spark={[4, 6, 8, 9, 10, 11, 12, 12]}/>
        </div>

        {/* Priority tiles */}
        <div className="grid gap-4 md:grid-cols-3">
          <QuickTile title="Pending Caterer Approvals" value={stats.pendingCatererApprovals} icon={ClipboardCheck} to="/admin/caterers" hint="Awaiting document review"/>
          <QuickTile title="Pending AI Menu Reviews" value={stats.pendingMenuReviews} icon={Sparkles} to="/admin/menu-review" hint="Ready for validation"/>
          <QuickTile title="Open Support Tickets" value={stats.openSupportTickets} icon={LifeBuoy} to="/admin/support" hint="Response SLA 4h"/>
        </div>

        {/* Charts */}

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="border-white/5 bg-card/60 backdrop-blur lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display">Revenue Overview</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Gross revenue and commission across the last 12 months
                </p>
              </div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                +12.4%
              </span>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueOverview} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45}/>
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="revLine" x1="0" y1="0" x2="1" y2="0">
                       <stop offset="0%" stopColor="var(--color-primary)"/>
                       <stop offset="100%" stopColor="var(--color-primary)"/>

                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" vertical={false}/>
                    <XAxis dataKey="month" stroke="oklch(0.7 0.03 265)" fontSize={11} tickLine={false} axisLine={false}/>
                    <YAxis stroke="oklch(0.7 0.03 265)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}/>
                    <Tooltip contentStyle={{
            background: "oklch(0.18 0.06 275)",
            border: "1px solid oklch(1 0 0 / 0.08)",
            borderRadius: 12,
            boxShadow: "0 20px 60px -20px oklch(0.12 0.04 275 / 0.7)",
        }} labelStyle={{ color: "oklch(0.85 0.02 260)" }} formatter={(v) => [`AED ${v.toLocaleString()}`, "Revenue"]}/>
                    <Area type="monotone" dataKey="revenue" stroke="url(#revLine)" strokeWidth={2.5} fill="url(#revFill)" activeDot={{ r: 5, fill: "var(--color-primary)", stroke: "white", strokeWidth: 2 }}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-display">Booking Trends</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Monthly booking volume</p>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingTrends} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.95}/>
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.25}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" vertical={false}/>
                    <XAxis dataKey="month" fontSize={11} stroke="oklch(0.7 0.03 265)" tickLine={false} axisLine={false}/>
                    <YAxis fontSize={11} stroke="oklch(0.7 0.03 265)" tickLine={false} axisLine={false}/>
                    <Tooltip cursor={{ fill: "oklch(1 0 0 / 0.03)" }} contentStyle={{
            background: "oklch(0.18 0.06 275)",
            border: "1px solid oklch(1 0 0 / 0.08)",
            borderRadius: 12,
        }}/>
                    <Bar dataKey="bookings" fill="url(#barFill)" radius={[8, 8, 0, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent bookings */}
        <Card className="border-white/5 bg-card/60 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display">Recent Bookings</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Latest transactions across the marketplace</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-primary hover:bg-primary/10 hover:text-primary">
              <Link to="/admin/bookings">
                View all <ArrowRight className="ml-1 h-4 w-4"/>
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="pb-3 font-medium">Booking</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Caterer</th>
                    <th className="pb-3 font-medium">Event</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.slice(0, 6).map((b) => (<tr key={b.id} className="group transition-colors hover:bg-primary/[0.04]">
                      <td className="py-3.5 font-mono text-xs text-primary">{b.id}</td>
                      <td className="text-foreground">{b.customer}</td>
                      <td className="text-muted-foreground">{b.caterer}</td>
                      <td className="text-muted-foreground">{b.eventType}</td>
                      <td className="font-display font-medium text-foreground">
                        AED {b.amount.toLocaleString()}
                      </td>
                      <td>
                        <StatusBadge status={b.status}/>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>);
}
function QuickTile({ title, value, icon: Icon, to, hint, glow, }) {
    return (<Link to={to} className="group">
      <Card className={`relative overflow-hidden border-white/5 bg-card/60 backdrop-blur transition-all group-hover:border-primary/40 group-hover:shadow-[0_0_40px_-12px_var(--color-primary)] ${glow ? "border-primary/30" : ""}`}>
        {glow && (<div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl"/>)}
        <CardContent className="relative flex items-center justify-between p-5">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {title}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-foreground">{value}</p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </div>
          <div className="rounded-2xl bg-primary/15 p-3 text-primary transition-transform group-hover:scale-110">
            <Icon className="h-6 w-6"/>
          </div>
        </CardContent>
      </Card>
    </Link>);
}
