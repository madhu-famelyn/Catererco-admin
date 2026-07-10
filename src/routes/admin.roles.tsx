import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { adminUsers, roles, permissionGroups } from "@/lib/mock-data";
import { Plus, Pencil } from "lucide-react";

export const Route = createFileRoute("/admin/roles")({
  component: RolesPage,
});

function RolesPage() {
  const userCols: Column<(typeof adminUsers)[number]>[] = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    { key: "lastLogin", header: "Last Login" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "actions", header: "", render: () => <Button size="sm" variant="ghost"><Pencil className="mr-1 h-4 w-4" /> Edit</Button> },
  ];
  const roleCols: Column<(typeof roles)[number]>[] = [
    { key: "name", header: "Role" },
    { key: "users", header: "Users" },
    { key: "permissions", header: "Permissions" },
    { key: "description", header: "Description" },
    { key: "actions", header: "", render: () => <Button size="sm" variant="ghost"><Pencil className="mr-1 h-4 w-4" /> Edit</Button> },
  ];

  return (
    <>
      <PageHeader
        title="Roles & Permissions"
        description="Manage admin accounts, roles and access control."
        actions={<Button><Plus className="mr-2 h-4 w-4" /> Invite Admin</Button>}
      />
      <div className="p-6">
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Admin Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-4">
            <DataTable data={adminUsers} columns={userCols} searchKeys={["name", "email", "role"]} />
          </TabsContent>
          <TabsContent value="roles" className="mt-4">
            <DataTable data={roles} columns={roleCols} searchKeys={["name"]} />
          </TabsContent>
          <TabsContent value="permissions" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Access Control</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {permissionGroups.map((g) => (
                  <div key={g.group} className="rounded-lg border p-4">
                    <p className="mb-3 text-sm font-semibold">{g.group}</p>
                    <div className="space-y-2">
                      {g.items.map((it) => (
                        <label key={it} className="flex items-center gap-2 text-sm">
                          <Checkbox defaultChecked /> {it}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
