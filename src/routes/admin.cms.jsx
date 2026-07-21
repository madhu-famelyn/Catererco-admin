import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/cms")({
    component: CmsPage,
});

const defaultBanners = [
    { id: "1", title: "Eid Special Catering Offer - Up to 20% Off", cta: "Book Offer", active: true },
    { id: "2", title: "Corporate Events Season Discount", cta: "Request Quote", active: true },
];

const defaultFaqs = [
    { id: "1", q: "How do I book a caterer on CatererCo?", a: "Browse caterers, customize your menu or guest count, and request an instant quotation or submit a custom inquiry." },
    { id: "2", q: "What payment methods are supported?", a: "We support Credit/Debit cards (Stripe) and direct bank transfers for corporate accounts." },
    { id: "3", q: "Are all caterers verified?", a: "Yes, every caterer on CatererCo undergoes Trade License, Food Safety, and VAT verification before going live." },
];

function CmsPage() {
    const [banners, setBanners] = useState(defaultBanners);
    const [faqList, setFaqList] = useState(defaultFaqs);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (message = "Content saved successfully") => {
        setIsSaving(true);
        toast.success(message);
        setTimeout(() => setIsSaving(false), 400);
    };

    const handleDeleteBanner = (id) => {
        setBanners(banners.filter((b) => b.id !== id));
        toast.success("Banner deleted");
    };

    const handleAddBanner = () => {
        const newB = { id: String(Date.now()), title: "New Promotional Banner", cta: "Learn More", active: true };
        setBanners([...banners, newB]);
        toast.success("New banner added");
    };

    const handleAddFaq = () => {
        const newF = { id: String(Date.now()), q: "New Frequently Asked Question", a: "Provide detailed answer here." };
        setFaqList([...faqList, newF]);
        toast.success("New FAQ added");
    };

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
                  <Button disabled={isSaving} onClick={() => handleSave("Landing page saved")}>
                    <Save className="mr-2 h-4 w-4"/> {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banners" className="mt-4 space-y-3">
            <div className="flex justify-end">
              <Button onClick={handleAddBanner}><Plus className="mr-2 h-4 w-4"/> Add banner</Button>
            </div>
            {banners.map((b) => (<Card key={b.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{b.title}</p>
                    <p className="text-xs text-muted-foreground">CTA: {b.cta}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Switch defaultChecked={b.active}/> Active
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteBanner(b.id)}><Trash2 className="h-4 w-4 text-rose-500"/></Button>
                  </div>
                </CardContent>
              </Card>))}
          </TabsContent>

          <TabsContent value="faqs" className="mt-4 space-y-3">
            <div className="flex justify-end">
              <Button onClick={handleAddFaq}><Plus className="mr-2 h-4 w-4"/> Add FAQ</Button>
            </div>
            {faqList.map((f) => (<Card key={f.id}>
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
                  <Textarea rows={14} defaultValue={`Content policies and guidelines for the ${k} page. Edit and publish.`}/>
                  <div className="flex justify-end">
                    <Button disabled={isSaving} onClick={() => handleSave(`${k.toUpperCase()} page saved`)}>
                      <Save className="mr-2 h-4 w-4"/> {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>))}

          <TabsContent value="contact" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Email</Label><Input defaultValue="hello@catererco.ae"/></div>
                <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+971 4 000 0000"/></div>
                <div className="space-y-2 md:col-span-2"><Label>Address</Label><Textarea defaultValue="Level 10, Business Bay Tower, Dubai, UAE"/></div>
                <div className="md:col-span-2 flex justify-end">
                  <Button disabled={isSaving} onClick={() => handleSave("Contact information saved")}>
                    <Save className="mr-2 h-4 w-4"/> {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>);
}
