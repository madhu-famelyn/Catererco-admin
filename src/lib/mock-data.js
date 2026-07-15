// Centralized mock data for the admin panel.
// Deterministic PRNG so SSR and client render identical mock data (avoids hydration mismatches).
let __seed = 1;
const seededRandom = () => {
    __seed = (__seed * 9301 + 49297) % 233280;
    return __seed / 233280;
};
const rand = (min, max) => Math.floor(seededRandom() * (max - min + 1)) + min;
export const dashboardStats = {
    totalBookings: 2847,
    totalRevenue: 1284530,
    activeCaterers: 184,
    activeCustomers: 5231,
    pendingCatererApprovals: 12,
    pendingMenuReviews: 8,
    pendingSupportTickets: 23,
};
export const revenueOverview = Array.from({ length: 12 }).map((_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    revenue: rand(60000, 180000),
    commission: rand(6000, 20000),
}));
export const bookingTrends = Array.from({ length: 12 }).map((_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    bookings: rand(120, 320),
}));
export const customerGrowth = Array.from({ length: 12 }).map((_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    customers: 500 + i * rand(120, 220),
}));
export const popularEventTypes = [
    { name: "Wedding", value: 42 },
    { name: "Corporate", value: 28 },
    { name: "Birthday", value: 15 },
    { name: "Anniversary", value: 9 },
    { name: "Other", value: 6 },
];
export const popularCuisines = [
    { name: "Emirati", value: 24 },
    { name: "Indian", value: 22 },
    { name: "Lebanese", value: 18 },
    { name: "Italian", value: 14 },
    { name: "Continental", value: 12 },
    { name: "Asian", value: 10 },
];
export const caterers = [
    {
        id: "c1",
        name: "Al Majlis Royale",
        owner: "Zayed Al Hashmi",
        email: "ops@almajlisroyale.ae",
        phone: "+971 4 399 2201",
        tradeLicense: "TL-UAE-9921",
        vatNumber: "100-234-567-89",
        city: "Dubai",
        status: "approved",
        rating: "4.9",
        bookings: 142,
        revenue: 284000,
        joinedAt: "2026-01-10",
        documents: ["Trade License.pdf", "VAT Certificate.pdf"],
    },
    {
        id: "c2",
        name: "Zafran Live Kitchen",
        owner: "Karan Johar",
        email: "info@zafranlive.ae",
        phone: "+971 2 642 1102",
        tradeLicense: "TL-AD-8841",
        vatNumber: "100-884-112-00",
        city: "Abu Dhabi",
        status: "approved",
        rating: "4.8",
        bookings: 98,
        revenue: 196000,
        joinedAt: "2026-02-15",
        documents: ["Trade License.pdf", "VAT Certificate.pdf"],
    },
    {
        id: "c3",
        name: "Coastline Yacht Catering",
        owner: "Captain Salim",
        email: "ahoy@coastlineyachts.ae",
        phone: "+971 4 882 3004",
        tradeLicense: "TL-DXB-4412",
        vatNumber: "100-441-229-11",
        city: "Dubai",
        status: "approved",
        rating: "4.9",
        bookings: 76,
        revenue: 152000,
        joinedAt: "2026-03-01",
        documents: ["Trade License.pdf", "VAT Certificate.pdf"],
    },
    {
        id: "c4",
        name: "The Grand Buffet Co.",
        owner: "Tariq Mansoor",
        email: "sales@grandbuffet.ae",
        phone: "+971 6 523 9000",
        tradeLicense: "TL-SHJ-3019",
        vatNumber: "100-301-998-22",
        city: "Sharjah",
        status: "approved",
        rating: "4.7",
        bookings: 64,
        revenue: 128000,
        joinedAt: "2026-03-20",
        documents: ["Trade License.pdf", "VAT Certificate.pdf"],
    },
    {
        id: "c5",
        name: "Saffron & Rose",
        owner: "Noura Al Zaabi",
        email: "hello@saffronrose.ae",
        phone: "+971 2 441 5532",
        tradeLicense: "TL-AD-1923",
        vatNumber: "100-192-334-55",
        city: "Abu Dhabi",
        status: "approved",
        rating: "4.9",
        bookings: 110,
        revenue: 220000,
        joinedAt: "2026-01-25",
        documents: ["Trade License.pdf", "VAT Certificate.pdf"],
    },
    {
        id: "c6",
        name: "Bayt Al Oud Kitchen",
        owner: "Hamdan Al Maktoum",
        email: "contact@baytaloud.ae",
        phone: "+971 4 331 8899",
        tradeLicense: "TL-DXB-8722",
        vatNumber: "100-872-221-99",
        city: "Dubai",
        status: "approved",
        rating: "4.8",
        bookings: 52,
        revenue: 104000,
        joinedAt: "2026-04-05",
        documents: ["Trade License.pdf", "VAT Certificate.pdf"],
    },
];
export const customers = Array.from({ length: 30 }).map((_, i) => ({
    id: `CU-${2000 + i}`,
    name: ["Sara Ahmed", "Omar Farooq", "Lina Khalid", "David Chen", "Aisha Rahman"][i % 5] + ` ${i + 1}`,
    email: `customer${i + 1}@example.ae`,
    phone: `+971 5${rand(0, 9)} ${rand(1000000, 9999999)}`,
    city: ["Dubai", "Abu Dhabi", "Sharjah"][i % 3],
    totalBookings: rand(1, 22),
    totalSpent: rand(500, 45000),
    status: ["active", "active", "active", "suspended"][i % 4],
    joinedAt: `2024-${String(rand(1, 12)).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
}));
export const bookings = Array.from({ length: 40 }).map((_, i) => ({
    id: `BK-${5000 + i}`,
    customer: customers[i % customers.length].name,
    customerId: customers[i % customers.length].id,
    caterer: caterers[i % caterers.length].name,
    catererId: caterers[i % caterers.length].id,
    eventType: ["Wedding", "Corporate", "Birthday", "Anniversary"][i % 4],
    eventDate: `2026-${String(rand(1, 12)).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
    guests: rand(20, 500),
    amount: rand(1500, 65000),
    status: ["pending", "completed", "cancelled", "in_progress"][i % 4],
    createdAt: `2025-${String(rand(1, 12)).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
}));
export const payments = Array.from({ length: 35 }).map((_, i) => ({
    id: `PY-${8000 + i}`,
    bookingId: bookings[i % bookings.length].id,
    customer: bookings[i % bookings.length].customer,
    caterer: bookings[i % bookings.length].caterer,
    amount: bookings[i % bookings.length].amount,
    commission: Math.floor(bookings[i % bookings.length].amount * 0.1),
    method: ["Card", "Bank Transfer", "Wallet"][i % 3],
    status: ["paid", "pending", "refunded", "failed"][i % 4],
    date: `2025-${String(rand(1, 12)).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
}));
export const settlements = Array.from({ length: 18 }).map((_, i) => ({
    id: `ST-${9000 + i}`,
    caterer: caterers[i % caterers.length].name,
    period: `2025-${String(rand(1, 12)).padStart(2, "0")}`,
    gross: rand(20000, 180000),
    commission: rand(2000, 18000),
    net: rand(18000, 160000),
    status: ["paid", "pending"][i % 2],
}));
export const refunds = Array.from({ length: 12 }).map((_, i) => ({
    id: `RF-${7000 + i}`,
    bookingId: bookings[i % bookings.length].id,
    customer: bookings[i % bookings.length].customer,
    amount: rand(500, 15000),
    reason: ["Event cancelled", "Caterer no-show", "Quality issue", "Duplicate payment"][i % 4],
    status: ["pending", "approved", "rejected"][i % 3],
    date: `2025-${String(rand(1, 12)).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
}));
export const menuReviews = Array.from({ length: 14 }).map((_, i) => ({
    id: `MR-${3000 + i}`,
    caterer: caterers[i % caterers.length].name,
    catererId: caterers[i % caterers.length].id,
    uploadedAt: `2025-11-${String(rand(1, 28)).padStart(2, "0")}`,
    itemsExtracted: rand(12, 80),
    confidence: rand(72, 99),
    status: ["pending", "approved", "rejected"][i % 3],
    items: Array.from({ length: 6 }).map((_, j) => ({
        id: `${i}-${j}`,
        name: ["Chicken Machboos", "Lamb Ouzi", "Hummus", "Tabbouleh", "Kunafa", "Mixed Grill"][j],
        category: ["Main", "Main", "Starter", "Starter", "Dessert", "Main"][j],
        price: rand(15, 120),
        extracted: true,
    })),
}));
export const reviews = Array.from({ length: 20 }).map((_, i) => ({
    id: `RV-${4000 + i}`,
    author: customers[i % customers.length].name,
    target: caterers[i % caterers.length].name,
    targetType: (i % 2 === 0 ? "caterer" : "customer"),
    rating: rand(1, 5),
    content: [
        "Excellent food and service, would book again!",
        "The presentation was beautiful but portions were small.",
        "Amazing experience, staff was very professional.",
        "Food arrived cold, disappointing.",
        "Perfect wedding catering, all guests loved it.",
    ][i % 5],
    images: i % 3 === 0 ? 2 : 0,
    reported: i % 5 === 0,
    status: ["pending", "approved", "rejected"][i % 3],
    date: `2025-11-${String(rand(1, 28)).padStart(2, "0")}`,
}));
export const supportTickets = Array.from({ length: 22 }).map((_, i) => ({
    id: `TK-${6000 + i}`,
    subject: [
        "Refund not received",
        "Caterer cancelled last minute",
        "Menu customization request",
        "Login issue",
        "Payment failed",
    ][i % 5],
    from: i % 2 ? customers[i % customers.length].name : caterers[i % caterers.length].name,
    type: (i % 2 ? "customer" : "caterer"),
    priority: ["low", "medium", "high", "urgent"][i % 4],
    status: ["open", "in_progress", "resolved"][i % 3],
    assignee: ["Unassigned", "Layla Admin", "Karim Support"][i % 3],
    createdAt: `2025-11-${String(rand(1, 28)).padStart(2, "0")}`,
}));
export const adminUsers = [
    { id: "AD-1", name: "Layla Admin", email: "layla@catermarket.ae", role: "Super Admin", status: "active", lastLogin: "2026-07-09 09:12" },
    { id: "AD-2", name: "Karim Support", email: "karim@catermarket.ae", role: "Support Manager", status: "active", lastLogin: "2026-07-08 18:04" },
    { id: "AD-3", name: "Nadia Ops", email: "nadia@catermarket.ae", role: "Operations", status: "active", lastLogin: "2026-07-07 12:33" },
    { id: "AD-4", name: "Yousef Finance", email: "yousef@catermarket.ae", role: "Finance", status: "suspended", lastLogin: "2026-06-20 10:00" },
];
export const roles = [
    { id: "R-1", name: "Super Admin", users: 1, permissions: 42, description: "Full access to all modules." },
    { id: "R-2", name: "Support Manager", users: 4, permissions: 18, description: "Manages support tickets and customer queries." },
    { id: "R-3", name: "Operations", users: 6, permissions: 22, description: "Handles bookings and caterer operations." },
    { id: "R-4", name: "Finance", users: 3, permissions: 14, description: "Manages payments, settlements and refunds." },
    { id: "R-5", name: "Content Editor", users: 2, permissions: 9, description: "Edits CMS content and announcements." },
];
export const permissionGroups = [
    { group: "Dashboard", items: ["View dashboard", "Export dashboard"] },
    { group: "Caterers", items: ["View caterers", "Approve caterers", "Reject caterers", "Request documents"] },
    { group: "Customers", items: ["View customers", "Suspend customers", "Reactivate customers"] },
    { group: "Bookings", items: ["View bookings", "Cancel bookings", "Resolve disputes"] },
    { group: "Payments", items: ["View payments", "Process refunds", "Manage payouts"] },
    { group: "CMS", items: ["Edit landing page", "Edit FAQs", "Edit policies"] },
    { group: "Settings", items: ["Edit platform settings", "Manage AI configuration", "Manage security"] },
];
export const emailTemplates = [
    { id: "ET-1", name: "Booking Confirmation", subject: "Your booking is confirmed", updatedAt: "2025-10-14" },
    { id: "ET-2", name: "Caterer Approval", subject: "Welcome to CaterMarket", updatedAt: "2025-09-30" },
    { id: "ET-3", name: "Payment Receipt", subject: "Payment received", updatedAt: "2025-11-02" },
    { id: "ET-4", name: "Password Reset OTP", subject: "Your verification code", updatedAt: "2025-08-11" },
    { id: "ET-5", name: "Refund Processed", subject: "Refund processed", updatedAt: "2025-10-22" },
];
export const notifications = Array.from({ length: 15 }).map((_, i) => ({
    id: `N-${i + 1}`,
    title: ["New caterer application", "Booking cancelled", "Payment received", "New support ticket", "Menu awaiting review"][i % 5],
    channel: ["Email", "Push", "In-App", "SMS"][i % 4],
    audience: ["All Customers", "All Caterers", "Admins", "Specific User"][i % 4],
    sentAt: `2025-11-${String(rand(1, 28)).padStart(2, "0")}`,
    status: ["sent", "sent", "sent"][0],
}));
export const faqs = [
    { id: "F-1", q: "How do I book a caterer?", a: "Browse caterers, request a quotation and confirm your booking with a deposit." },
    { id: "F-2", q: "What is the commission rate?", a: "The platform commission is 10% of the total booking value." },
    { id: "F-3", q: "How are refunds processed?", a: "Refunds are processed within 5-7 business days to the original payment method." },
    { id: "F-4", q: "Can I customize a menu?", a: "Yes, you can request menu customization from the caterer during quotation." },
];
export const cmsBanners = [
    { id: "B-1", title: "Wedding Season Sale", cta: "Explore Packages", active: true },
    { id: "B-2", title: "Corporate Catering 20% Off", cta: "Book Now", active: true },
    { id: "B-3", title: "New Caterers This Month", cta: "Discover", active: false },
];
