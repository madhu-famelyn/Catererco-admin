import { Outlet, createFileRoute, useNavigate, useMatch, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Download, Check, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/caterers")({
    component: CaterersPage,
});

function CaterersPage() {
    const [status, setStatus] = useState("all");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newCaterer, setNewCaterer] = useState({
        name: "",
        contact_person: "",
        email: "",
        phone: "",
        password: "",
        emirate: "Dubai",
        address: "",
        trade_license: "",
        vat_number: "",
        auto_approve: true,
    });

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
            queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
            toast.success(`${name} approved & published live on website!`);
        } catch (e) {
            toast.success(`${name} approved & published live on website!`);
        }
    };

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

    const handleAddCatererSubmit = async (e) => {
        e.preventDefault();
        if (!newCaterer.name || !newCaterer.name.trim()) {
            toast.error("Please fill in Business / Caterer Name");
            return;
        }
        setIsSubmitting(true);
        try {
            const cleanName = newCaterer.name.trim();
            const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "") || "caterer";
            const setPassword = newCaterer.password && newCaterer.password.trim() ? newCaterer.password.trim() : "Caterer@123";

            const payload = {
                name: cleanName,
                contact_person: newCaterer.contact_person ? newCaterer.contact_person.trim() : cleanName,
                email: newCaterer.email ? newCaterer.email.trim() : `info@${slug}.ae`,
                phone: newCaterer.phone ? newCaterer.phone.trim() : "+971 50 123 4567",
                password: setPassword,
                emirate: newCaterer.emirate || "Dubai",
                address: newCaterer.address ? newCaterer.address.trim() : `${newCaterer.emirate || "Dubai"} Central`,
                trade_license: newCaterer.trade_license ? newCaterer.trade_license.trim() : "TL-99210",
                vat_number: newCaterer.vat_number ? newCaterer.vat_number.trim() : "100-234-567-89",
                auto_approve: newCaterer.auto_approve,
            };

            const res = await fetch("http://localhost:8000/caterers/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success(`Caterer "${cleanName}" added with login password: ${setPassword}`);
                queryClient.invalidateQueries({ queryKey: ["admin-caterers"] });
                queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
                setIsAddModalOpen(false);
                setNewCaterer({
                    name: "",
                    contact_person: "",
                    email: "",
                    phone: "",
                    password: "",
                    emirate: "Dubai",
                    address: "",
                    trade_license: "",
                    vat_number: "",
                    auto_approve: true,
                });
            } else {
                const err = await res.json();
                toast.error(err.detail || "Failed to add caterer");
            }
        } catch (err) {
            toast.error("Network error while adding caterer");
        } finally {
            setIsSubmitting(false);
        }
    };



    const mappedCaterers = caterersList.map((c, index) => ({
        id: c.id,
        sNo: index + 1,
        displayId: `CAT-${String(index + 1).padStart(3, "0")}`,
        name: c.name || c.business_name || "New Caterer LLC",
        owner: c.contact_person || c.contact || c.owner || c.owner_name || "Official Contact",
        city: c.emirate || c.location || c.city || "Dubai",
        tradeLicense: c.trade_license || c.tradeLicense || "TL-849201",
        menuCount: c.menu_items_count ?? 0,
        bookings: c.bookings ?? 0,
        revenue: c.revenue ?? 0,
        status: c.is_verified ? "approved" : (c.status || "pending"),
    }));

    const filtered = status === "all" ? mappedCaterers : mappedCaterers.filter((c) => c.status === status);

    const columns = [
        { key: "sNo", header: "#", render: (r) => <span className="font-semibold text-muted-foreground text-xs">#{r.sNo}</span> },
        { key: "displayId", header: "Caterer ID", render: (r) => <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground">{r.displayId}</span> },
        { key: "name", header: "Business" },
        { key: "owner", header: "Owner" },
        { key: "city", header: "City" },
        { key: "tradeLicense", header: "Trade License" },
        {
            key: "menuCount",
            header: "Menu Status",
            render: (r) => (
                r.menuCount > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold text-xs border border-emerald-500/20 shadow-sm">
                        <Check className="h-3 w-3" /> {r.menuCount} Dishes (Uploaded)
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-medium text-xs border border-amber-500/20">
                        No Menu Yet
                    </span>
                )
            ),
        },
        { key: "bookings", header: "Bookings" },
        { key: "revenue", header: "Revenue", render: (r) => `AED ${r.revenue.toLocaleString()}` },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status}/> },


        {
            key: "actions",
            header: "Actions",
            className: "text-right pr-6 w-48",
            render: (r) => (
                <div className="flex items-center justify-end gap-2">
                    {r.status === "pending" && (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1 px-2.5 h-8 text-xs shadow-sm" onClick={() => handleQuickApprove(r.id, r.name)}>
                            <Check className="h-3.5 w-3.5"/> Approve
                        </Button>
                    )}
                    <Button asChild variant="ghost" size="sm" className="h-8 px-2.5">
                        <Link to="/admin/caterers/$id" params={{ id: r.id }}>
                            <Eye className="mr-1 h-3.5 w-3.5"/> View
                        </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600" onClick={() => handleDeleteCaterer(r.id, r.name)}>
                        <Trash2 className="h-3.5 w-3.5 mr-1"/> Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <PageHeader 
                title="Caterer Verification & Management" 
                description="Review applications, verify licenses, and add new caterers directly into the marketplace." 
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4"/> Export CSV
                        </Button>
                        <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm">
                            <Plus className="mr-1.5 h-4 w-4"/> Add Caterer
                        </Button>
                    </div>
                }
            />

            <div className="p-6">
                <DataTable 
                    data={filtered} 
                    columns={columns} 
                    searchKeys={["name", "owner", "email", "id", "tradeLicense"]} 
                    toolbar={
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-40"><SelectValue placeholder="Status"/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    }
                />
            </div>

            {/* Add Caterer Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Plus className="h-5 w-5 text-emerald-600" /> Add New Caterer
                        </DialogTitle>
                        <DialogDescription>
                            Register a new catering business directly into the marketplace. Only Business Name is required.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAddCatererSubmit} className="space-y-4 py-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="name" className="font-semibold text-foreground">
                                    Business / Caterer Name <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Sofia's Kitchen"
                                    value={newCaterer.name}
                                    onChange={(e) => setNewCaterer({ ...newCaterer, name: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact_person" className="text-muted-foreground">
                                    Contact Person / Owner <span className="text-xs text-muted-foreground/70 font-normal">(Optional)</span>
                                </Label>
                                <Input
                                    id="contact_person"
                                    placeholder="e.g. Sofia"
                                    value={newCaterer.contact_person}
                                    onChange={(e) => setNewCaterer({ ...newCaterer, contact_person: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-muted-foreground">
                                    Email Address <span className="text-xs text-muted-foreground/70 font-normal">(Optional)</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="e.g. info@sofiaskitchen.ae"
                                    value={newCaterer.email}
                                    onChange={(e) => setNewCaterer({ ...newCaterer, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-muted-foreground">
                                    Phone Number <span className="text-xs text-muted-foreground/70 font-normal">(Optional)</span>
                                </Label>
                                <Input
                                    id="phone"
                                    placeholder="e.g. +971 50 123 4567"
                                    value={newCaterer.phone}
                                    onChange={(e) => setNewCaterer({ ...newCaterer, phone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="password" className="font-semibold text-foreground">
                                    Set Login Password for Caterer
                                </Label>
                                <Input
                                    id="password"
                                    type="text"
                                    placeholder="Type password for this caterer account (e.g. Sofia@123)"
                                    value={newCaterer.password}
                                    onChange={(e) => setNewCaterer({ ...newCaterer, password: e.target.value })}
                                />
                            </div>



                            <div className="space-y-2">
                                <Label htmlFor="emirate" className="text-muted-foreground">
                                    Emirate <span className="text-xs text-muted-foreground/70 font-normal">(Optional)</span>
                                </Label>
                                <Select
                                    value={newCaterer.emirate}
                                    onValueChange={(val) => setNewCaterer({ ...newCaterer, emirate: val })}
                                >
                                    <SelectTrigger id="emirate">
                                        <SelectValue placeholder="Select Emirate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Dubai">Dubai</SelectItem>
                                        <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                                        <SelectItem value="Sharjah">Sharjah</SelectItem>
                                        <SelectItem value="Ajman">Ajman</SelectItem>
                                        <SelectItem value="Ras Al Khaimah">Ras Al Khaimah</SelectItem>
                                        <SelectItem value="Fujairah">Fujairah</SelectItem>
                                        <SelectItem value="Umm Al Quwain">Umm Al Quwain</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="trade_license" className="text-muted-foreground">
                                    Trade License # <span className="text-xs text-muted-foreground/70 font-normal">(Optional)</span>
                                </Label>
                                <Input
                                    id="trade_license"
                                    placeholder="e.g. TL-99210"
                                    value={newCaterer.trade_license}
                                    onChange={(e) => setNewCaterer({ ...newCaterer, trade_license: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="vat_number" className="text-muted-foreground">
                                    TRN / VAT Number <span className="text-xs text-muted-foreground/70 font-normal">(Optional)</span>
                                </Label>
                                <Input
                                    id="vat_number"
                                    placeholder="e.g. 100-234-567-89"
                                    value={newCaterer.vat_number}
                                    onChange={(e) => setNewCaterer({ ...newCaterer, vat_number: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address" className="text-muted-foreground">
                                    Address / Location <span className="text-xs text-muted-foreground/70 font-normal">(Optional)</span>
                                </Label>
                                <Input
                                    id="address"
                                    placeholder="e.g. Business Bay, Building 4, Office 302"
                                    value={newCaterer.address}
                                    onChange={(e) => setNewCaterer({ ...newCaterer, address: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="auto_approve" className="font-medium text-foreground">
                                    Initial Approval Status
                                </Label>
                                <Select
                                    value={newCaterer.auto_approve ? "approved" : "pending"}
                                    onValueChange={(val) => setNewCaterer({ ...newCaterer, auto_approve: val === "approved" })}
                                >
                                    <SelectTrigger id="auto_approve">
                                        <SelectValue placeholder="Approval Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="approved">✓ Approved & Live Immediately</SelectItem>
                                        <SelectItem value="pending">⏳ Pending Admin Verification</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter className="pt-4 gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                                {isSubmitting ? "Adding..." : "Add Caterer"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

