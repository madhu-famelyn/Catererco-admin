import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Save, KeyRound } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <>
      <PageHeader title="My Profile" description="Update your personal information." />
      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">LA</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">Layla Admin</p>
              <p className="text-sm text-muted-foreground">Super Admin</p>
            </div>
            <Button variant="outline" size="sm">Change photo</Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/change-password"><KeyRound className="mr-2 h-4 w-4" /> Change password</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Full Name" value="Layla Admin" />
            <Field label="Email" value="layla@catermarket.ae" />
            <Field label="Phone" value="+971 50 000 0000" />
            <Field label="Role" value="Super Admin" disabled />
            <Field label="Language" value="English" />
            <Field label="Timezone" value="Asia/Dubai (GMT+4)" />
            <div className="md:col-span-2 flex justify-end">
              <Button onClick={() => toast.success("Profile updated")}><Save className="mr-2 h-4 w-4" /> Save changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
function Field({ label, value, disabled }: { label: string; value: string; disabled?: boolean }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input defaultValue={value} disabled={disabled} />
    </div>
  );
}
