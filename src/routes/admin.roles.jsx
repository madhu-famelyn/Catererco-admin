import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { roles as defaultRoles, permissionGroups } from "@/lib/mock-data";
import { Trash2, UserPlus, Pencil, Loader2, Key } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/roles")({
    component: RolesPage,
});

const ACCESS_POINTS = [
    { id: "caterers", label: "Caterers Management & Approval" },
    { id: "bookings", label: "Bookings & Customer Orders" },
    { id: "menu", label: "AI Menu Review & Verification" },
    { id: "payments", label: "Payments, Payouts & Refunds" },
    { id: "support", label: "Support Inbox & Ticket Resolutions" },
    { id: "analytics", label: "Analytics & Export Reports" },
    { id: "cms", label: "CMS Banners & FAQ Manager" },
    { id: "roles", label: "Roles & Admin Access Control" },
];

function normalizePermissionLabel(p) {
    if (!p) return p;
    const str = String(p).toLowerCase();
    if (str.includes("caterer")) return "Caterers Management & Approval";
    if (str.includes("booking")) return "Bookings & Customer Orders";
    if (str.includes("menu")) return "AI Menu Review & Verification";
    if (str.includes("payment") || str.includes("payout") || str.includes("refund")) return "Payments, Payouts & Refunds";
    if (str.includes("support")) return "Support Inbox & Ticket Resolutions";
    if (str.includes("analytic") || str.includes("export")) return "Analytics & Export Reports";
    if (str.includes("cms") || str.includes("banner") || str.includes("faq")) return "CMS Banners & FAQ Manager";
    if (str.includes("role") || str.includes("permission")) return "Roles & Admin Access Control";
    return p;
}

function RolesPage() {
    const queryClient = useQueryClient();
    const [inviteOpen, setInviteOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Super Admin");
    const [selectedPermissions, setSelectedPermissions] = useState([
        "Caterers Management & Approval",
        "Bookings & Customer Orders",
        "AI Menu Review & Verification",
        "Payments, Payouts & Refunds",
    ]);

    const [editingUser, setEditingUser] = useState(null);
    const [editPermissions, setEditPermissions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: rawUsers = [] } = useQuery({
        queryKey: ["admin-roles-users"],
        queryFn: async () => {
            try {
                const res = await fetch("http://localhost:8000/users");
                if (res.ok) return await res.json();
            } catch (e) {}
            return [];
        },
        refetchInterval: 5000,
    });

    const liveAdminUsers = rawUsers
        .filter((u) => u.role === "admin" || u.role === "ADMIN" || u.role === "superadmin")
        .concat(
            rawUsers.filter((u) => u.role !== "admin" && u.role !== "ADMIN" && u.role !== "superadmin").slice(0, 2)
        )
        .map((u) => {
            const userPerms = u.permissions && u.permissions.length > 0
                ? Array.from(new Set(u.permissions.map(normalizePermissionLabel)))
                : [
                    "Caterers Management & Approval",
                    "Bookings & Customer Orders",
                    "AI Menu Review & Verification",
                    "Payments, Payouts & Refunds",
                ];
            return {
                id: u.id,
                name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email,
                email: u.email,
                role: (u.role || "Admin").toUpperCase(),
                permissions: userPerms,
                lastLogin: "Active Today",
                status: u.is_verified ? "active" : "pending",
            };
        });

    const togglePermission = (label, isEdit = false) => {
        if (isEdit) {
            setEditPermissions((prev) =>
                prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
            );
        } else {
            setSelectedPermissions((prev) =>
                prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
            );
        }
    };

    const handleDeleteUser = async (id, userName) => {
        if (!confirm(`Are you sure you want to revoke access and remove admin "${userName}"?`)) return;
        try {
            await fetch(`http://localhost:8000/users/${id}`, { method: "DELETE" });
            queryClient.invalidateQueries({ queryKey: ["admin-roles-users"] });
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success(`Access revoked for "${userName}"`);
        } catch (e) {
            toast.error("Failed to remove admin");
        }
    };

    const handleInviteAdmin = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            toast.error("Please fill in full name and email address");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("http://localhost:8000/users/invite-admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    role,
                    permissions: selectedPermissions,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(data.message || `Access email dispatched to ${email}!`);
                setName("");
                setEmail("");
                setInviteOpen(false);
                queryClient.invalidateQueries({ queryKey: ["admin-roles-users"] });
            } else {
                toast.error("Failed to send admin invitation email");
            }
        } catch (err) {
            toast.error("Error connecting to server");
        } finally {
            setIsSubmitting(false);
        }
    };

    const [isUpdatingPermissions, setIsUpdatingPermissions] = useState(false);

    const handleSaveEditPermissions = async (e) => {
        e.preventDefault();
        setIsUpdatingPermissions(true);
        try {
            const res = await fetch(`http://localhost:8000/users/${editingUser.id}/permissions`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ permissions: editPermissions }),
            });
            if (res.ok) {
                toast.success(`Access permissions updated for ${editingUser.name}!`);
                queryClient.invalidateQueries({ queryKey: ["admin-roles-users"] });
                setEditingUser(null);
            } else {
                toast.error("Failed to update access permissions");
            }
        } catch (err) {
            toast.error("Error connecting to server");
        } finally {
            setIsUpdatingPermissions(false);
        }
    };

    const handleOpenEdit = (user) => {
        setEditingUser(user);
        const userPerms = (user.permissions || []).map(normalizePermissionLabel);
        setEditPermissions(userPerms);
    };

    const userCols = [
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        { key: "role", header: "Role" },
        {
            key: "permissions",
            header: "Granted Access Points",
            render: (r) => (
                <div className="flex flex-wrap gap-1.5 max-w-sm py-1">
                    {r.permissions.map((p) => (
                        <Badge
                            key={p}
                            variant="outline"
                            className="text-xs font-semibold py-1 px-2.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 flex items-center gap-1.5 shadow-sm"
                        >
                            <Key className="h-3 w-3 text-emerald-500"/> {p}
                        </Badge>
                    ))}
                </div>
            ),
        },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status}/> },
        {
            key: "actions",
            header: "Actions",
            className: "text-right pr-6 w-48",
            render: (r) => (
                <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => handleOpenEdit(r)}>
                        <Pencil className="mr-1 h-3.5 w-3.5"/> Edit Access
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 px-2 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600" onClick={() => handleDeleteUser(r.id, r.name)}>
                        <Trash2 className="mr-1 h-3.5 w-3.5"/> Revoke
                    </Button>
                </div>
            ),
        },
    ];

    const roleCols = [
        { key: "name", header: "Role" },
        { key: "users", header: "Users" },
        { key: "permissions", header: "Permissions" },
        { key: "description", header: "Description" },
    ];

    return (<>
      <PageHeader title="Roles & Permissions" description="Manage system accounts, roles and access control." actions={
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button><UserPlus className="mr-2 h-4 w-4"/> Invite Admin</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Invite New Administrator & Assign Access</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleInviteAdmin} className="space-y-4 my-2">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Full Name</Label>
                    <Input placeholder="e.g. Layla Admin" value={name} onChange={(e) => setName(e.target.value)}/>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email Address</Label>
                    <Input type="email" placeholder="admin@catererco.ae" value={email} onChange={(e) => setEmail(e.target.value)}/>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Assign Administrative Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                      <SelectItem value="Support Lead">Support Lead</SelectItem>
                      <SelectItem value="Finance Officer">Finance Officer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/60">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Granted Access Checkboxes</Label>
                  <div className="grid gap-2 bg-muted/40 p-3 rounded-xl border border-border/60">
                    {ACCESS_POINTS.map((ap) => {
                      const isChecked = selectedPermissions.includes(ap.label);
                      return (
                        <label
                          key={ap.id}
                          className={`flex items-center gap-3 p-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                            isChecked
                              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs"
                              : "bg-background/60 border-border/40 text-foreground hover:bg-muted/80"
                          }`}
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => togglePermission(ap.label)}
                            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 h-4 w-4"
                          />
                          {ap.label}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <UserPlus className="mr-2 h-4 w-4"/>}
                    {isSubmitting ? "Dispatching Invite..." : "Send Invitation & Access Email"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
      }/>
      <div className="p-6">
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Admin Accounts ({liveAdminUsers.length})</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-4">
            <DataTable data={liveAdminUsers} columns={userCols} searchKeys={["name", "email", "role"]}/>
          </TabsContent>
          <TabsContent value="roles" className="mt-4">
            <DataTable data={defaultRoles} columns={roleCols} searchKeys={["name"]}/>
          </TabsContent>
          <TabsContent value="permissions" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Access Control Matrix</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {permissionGroups.map((g) => (<div key={g.group} className="rounded-lg border p-4">
                    <p className="mb-3 text-sm font-semibold">{g.group}</p>
                    <div className="space-y-2">
                      {g.items.map((it) => (<label key={it} className="flex items-center gap-2 text-sm">
                          <Checkbox defaultChecked/> {it}
                        </label>))}
                    </div>
                  </div>))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Edit Access Permissions for {editingUser?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEditPermissions} className="space-y-4 my-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Granted Access Checkboxes</Label>
              <div className="grid gap-2 bg-muted/40 p-3 rounded-xl border border-border/60">
                {ACCESS_POINTS.map((ap) => {
                  const isChecked = editPermissions.includes(ap.label);
                  return (
                    <label
                      key={ap.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                        isChecked
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs"
                          : "bg-background/60 border-border/40 text-foreground hover:bg-muted/80"
                      }`}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => togglePermission(ap.label, true)}
                        className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 h-4 w-4"
                      />
                      {ap.label}
                    </label>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
              <Button type="submit" disabled={isUpdatingPermissions} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                {isUpdatingPermissions ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                {isUpdatingPermissions ? "Saving Changes..." : "Save Updated Access"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>);
}
