import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
export const Route = createFileRoute("/login")({
    component: LoginPage,
});
function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("admin@catererco.ae");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    return (<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <UtensilsCrossed className="h-6 w-6"/>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground">CatererCo Admin</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/admin" });
        }}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" required/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none">
                  {showPassword ? (<EyeOff className="h-4 w-4"/>) : (<Eye className="h-4 w-4"/>)}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">Sign in</Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo: use any credentials to explore the dashboard.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>);
}
