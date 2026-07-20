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
export const caterers = [];
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
export const bookings = [];
export const payments = [];
export const settlements = [];
export const refunds = [];
export const menuReviews = [];
export const reviews = [];
export const supportTickets = Array.from({ length: 22 }).map((_, i) => ({
    id: `TK-${6000 + i}`,
    subject: [
        "Refund not received",
        "Caterer cancelled last minute",
        "Menu customization request",
        "Login issue",
        "Payment failed",
    ][i % 5],
    from: customers[i % customers.length].name,
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
