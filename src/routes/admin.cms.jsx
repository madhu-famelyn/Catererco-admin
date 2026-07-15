import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { faqs, cmsBanners } from "@/lib/mock-data";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
export const Route = createFileRoute("/admin/cms")({
    component: CmsPage,
});
function CmsPage() {
    return (<>
      <PageHeader title="Content Management" description="Manage landing page, policies, FAQs and promotions."/>
      <div className="p-6">
        <Tabs defaultValue="landing">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="landing">Landing Page</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="about">About Us</TabsTrigger>
            <TabsTrigger value="terms">Terms</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="landing" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Homepage Hero</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Headline</Label><Input defaultValue="Book the best caterers in the UAE"/></div>
                <div className="space-y-2"><Label>Subheadline</Label><Input defaultValue="Weddings, corporate events and more."/></div>
                <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea rows={4} defaultValue="Compare menus, get instant quotations and book with confidence."/></div>
                <div className="space-y-2"><Label>Primary CTA</Label><Input defaultValue="Get a Quotation"/></div>
                <div className="space-y-2"><Label>Secondary CTA</Label><Input defaultValue="Browse Caterers"/></div>
                <div className="md:col-span-2 flex justify-end">
                  <Button onClick={() => toast.success("Landing page saved")}><Save className="mr-2 h-4 w-4"/> Save</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banners" className="mt-4 space-y-3">
            <div className="flex justify-end">
              <Button><Plus className="mr-2 h-4 w-4"/> Add banner</Button>
            </div>
            {cmsBanners.map((b) => (<Card key={b.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{b.title}</p>
                    <p className="text-xs text-muted-foreground">CTA: {b.cta}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Switch defaultChecked={b.active}/> Active
                    </div>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4"/></Button>
                  </div>
                </CardContent>
              </Card>))}
          </TabsContent>

          <TabsContent value="faqs" className="mt-4 space-y-3">
            <div className="flex justify-end">
              <Button><Plus className="mr-2 h-4 w-4"/> Add FAQ</Button>
            </div>
            {faqs.map((f) => (<Card key={f.id}>
                <CardContent className="space-y-2 p-4">
                  <Input defaultValue={f.q}/>
                  <Textarea rows={2} defaultValue={f.a}/>
                </CardContent>
              </Card>))}
          </TabsContent>

          {["about", "terms", "privacy"].map((k) => (<TabsContent key={k} value={k} className="mt-4">
              <Card>
                <CardHeader><CardTitle className="capitalize">{k}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Textarea rows={14} defaultValue={`Placeholder content for the ${k} page. Edit and publish.`}/>
                  <div className="flex justify-end"><Button onClick={() => toast.success("Saved")}><Save className="mr-2 h-4 w-4"/> Save</Button></div>
                </CardContent>
              </Card>
            </TabsContent>))}

          <TabsContent value="contact" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Email</Label><Input defaultValue="hello@catermarket.ae"/></div>
                <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+971 4 000 0000"/></div>
                <div className="space-y-2 md:col-span-2"><Label>Address</Label><Textarea defaultValue="Level 10, Business Bay Tower, Dubai, UAE"/></div>
                <div className="md:col-span-2 flex justify-end"><Button onClick={() => toast.success("Saved")}><Save className="mr-2 h-4 w-4"/> Save</Button></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>);
}
