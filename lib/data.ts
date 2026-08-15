import { Product, Collection, Order, Customer } from "./types";

export const collections: Collection[] = [
  { slug: "hampers", name: "Gift Hampers", tagline: "Curated boxes for every occasion", gradient: ["#f1cdd2", "#c79a3e"] },
  { slug: "pendants", name: "Pendants", tagline: "Small charms, big meaning", gradient: ["#e7c9d6", "#7a2b3f"] },
  { slug: "bracelets", name: "Bracelets", tagline: "Stack-friendly everyday pieces", gradient: ["#f3e6d8", "#b34a5c"] },
  { slug: "earrings", name: "Earrings", tagline: "From studs to statements", gradient: ["#f8e3e6", "#c79a3e"] },
  { slug: "jhumkas", name: "Jhumkas", tagline: "Festive drop earrings", gradient: ["#e9d5c0", "#7a2b3f"] },
  { slug: "rings", name: "Rings", tagline: "Delicate everyday bands", gradient: ["#f1cdd2", "#77836a"] },
  { slug: "keychains", name: "Keychains", tagline: "A little something for the everyday carry", gradient: ["#e0d3ea", "#591f2e"] },
  { slug: "scrunchies", name: "Scrunchies", tagline: "Soft ties, softer palettes", gradient: ["#f8e3e6", "#b34a5c"] },
  { slug: "claw-clips", name: "Claw Clips", tagline: "Hold-all-day hair essentials", gradient: ["#f3e6d8", "#c79a3e"] },
  { slug: "packaging", name: "Custom Packaging", tagline: "Dress up any box your way", gradient: ["#e9d5c0", "#7a2b3f"] },
];

export const products: Product[] = [
  { id: "p1", slug: "amber-bloom-hamper", name: "Amber Bloom Hamper", price: 1899, compareAt: 2399, category: "Hampers", collectionSlugs: ["hampers"], image: "hamper", gradient: ["#f1cdd2", "#c79a3e"], badge: "Bestseller", description: "A layered keepsake box with a scented candle, a charm bracelet, and a hand-folded note card — wrapped in muslin and tied with silk ribbon.", stock: 18, rating: 4.8, reviews: 132 },
  { id: "p2", slug: "midnight-plum-hamper", name: "Midnight Plum Hamper", price: 2299, compareAt: 2899, category: "Hampers", collectionSlugs: ["hampers"], image: "hamper", gradient: ["#7a2b3f", "#2b2320"], badge: "Sale", description: "Deep plum velvet box featuring a pendant, a mini perfume, and Belgian chocolates for the person who notices detail.", stock: 9, rating: 4.9, reviews: 87 },
  { id: "p3", slug: "sunlit-rakhi-set", name: "Sunlit Rakhi Hamper", price: 1499, compareAt: 1899, category: "Hampers", collectionSlugs: ["hampers"], image: "hamper", gradient: ["#c79a3e", "#f1cdd2"], badge: "Sale", description: "A sibling-day box with a woven rakhi, roasted almonds, and a handwritten card slot.", stock: 24, rating: 4.7, reviews: 64 },
  { id: "p4", slug: "tulip-drop-pendant", name: "Tulip Drop Pendant", price: 349, category: "Pendants", collectionSlugs: ["pendants"], image: "pendant", gradient: ["#e7c9d6", "#7a2b3f"], badge: "New", description: "A hand-finished brass tulip on an adjustable 18-inch chain. Tarnish-resistant plating.", stock: 41, rating: 4.6, reviews: 51 },
  { id: "p5", slug: "aster-locket-pendant", name: "Aster Locket Pendant", price: 429, category: "Pendants", collectionSlugs: ["pendants"], image: "pendant", gradient: ["#b34a5c", "#f3e6d8"], description: "An openable locket pendant with room for a photo or a pressed flower.", stock: 22, rating: 4.5, reviews: 38 },
  { id: "p6", slug: "woven-thread-bracelet", name: "Woven Thread Bracelet", price: 249, category: "Bracelets", collectionSlugs: ["bracelets"], image: "bracelet", gradient: ["#f3e6d8", "#b34a5c"], description: "Adjustable cord bracelet with a brass sliding knot — layers beautifully with others.", stock: 60, rating: 4.4, reviews: 76 },
  { id: "p7", slug: "petal-charm-bracelet", name: "Petal Charm Bracelet", price: 399, compareAt: 549, category: "Bracelets", collectionSlugs: ["bracelets"], image: "bracelet", gradient: ["#f1cdd2", "#77836a"], badge: "Sale", description: "Five enamel petal charms on a fine chain bracelet with lobster clasp.", stock: 14, rating: 4.7, reviews: 44 },
  { id: "p8", slug: "dew-drop-studs", name: "Dew Drop Studs", price: 199, category: "Earrings", collectionSlugs: ["earrings"], image: "earring", gradient: ["#f8e3e6", "#c79a3e"], description: "Minimal glass-bead studs that catch light without ever feeling heavy.", stock: 55, rating: 4.5, reviews: 29 },
  { id: "p9", slug: "gilded-hoop-set", name: "Gilded Hoop Set (3 pairs)", price: 349, compareAt: 449, category: "Earrings", collectionSlugs: ["earrings"], image: "earring", gradient: ["#c79a3e", "#7a2b3f"], badge: "Sale", description: "Three hoop sizes in a set — small, medium, statement — for every outfit mood.", stock: 30, rating: 4.6, reviews: 58 },
  { id: "p10", slug: "moonlight-jhumka", name: "Moonlight Jhumka", price: 249, category: "Jhumkas", collectionSlugs: ["jhumkas"], image: "jhumka", gradient: ["#e9d5c0", "#7a2b3f"], badge: "Bestseller", description: "Pearl-drop jhumkas with a matte gold dome — festive without the weight.", stock: 27, rating: 4.8, reviews: 91 },
  { id: "p11", slug: "peacock-dance-jhumka", name: "Peacock Dance Jhumka", price: 199, category: "Jhumkas", collectionSlugs: ["jhumkas"], image: "jhumka", gradient: ["#77836a", "#7a2b3f"], description: "Hand-painted peacock motif jhumkas with a jhalar fringe.", stock: 33, rating: 4.6, reviews: 40 },
  { id: "p12", slug: "signet-band-ring", name: "Signet Band Ring", price: 179, category: "Rings", collectionSlugs: ["rings"], image: "ring", gradient: ["#f1cdd2", "#77836a"], description: "Adjustable brass signet band that sits flush against the finger.", stock: 48, rating: 4.4, reviews: 22 },
  { id: "p13", slug: "stacked-stone-ring", name: "Stacked Stone Ring", price: 229, compareAt: 299, category: "Rings", collectionSlugs: ["rings"], image: "ring", gradient: ["#b34a5c", "#c79a3e"], badge: "Sale", description: "A trio of thin bands set with a single cut-glass stone each — worn together or apart.", stock: 19, rating: 4.5, reviews: 31 },
  { id: "p14", slug: "spirit-fox-keychain", name: "Spirit Fox Keychain", price: 149, category: "Keychains", collectionSlugs: ["keychains"], image: "keychain", gradient: ["#e0d3ea", "#591f2e"], description: "Enamel fox charm keychain with a solid clip ring — built for daily use.", stock: 70, rating: 4.3, reviews: 18 },
  { id: "p15", slug: "wanderer-map-keychain", name: "Wanderer Map Keychain", price: 139, category: "Keychains", collectionSlugs: ["keychains"], image: "keychain", gradient: ["#c79a3e", "#2b2320"], description: "A tiny embossed compass keychain for the one who's always planning the next trip.", stock: 44, rating: 4.4, reviews: 25 },
  { id: "p16", slug: "silk-touch-scrunchie", name: "Silk-Touch Scrunchie Set (3)", price: 179, category: "Scrunchies", collectionSlugs: ["scrunchies"], image: "scrunchie", gradient: ["#f8e3e6", "#b34a5c"], description: "Three oversized scrunchies in complementary tones, finished with a satin-touch fabric.", stock: 38, rating: 4.6, reviews: 34 },
  { id: "p17", slug: "linen-bow-scrunchie", name: "Linen Bow Scrunchie", price: 99, category: "Scrunchies", collectionSlugs: ["scrunchies"], image: "scrunchie", gradient: ["#f3e6d8", "#7a2b3f"], description: "A textured linen scrunchie with an oversized bow tail.", stock: 52, rating: 4.2, reviews: 15 },
  { id: "p18", slug: "pearl-edge-claw-clip", name: "Pearl-Edge Claw Clip", price: 129, category: "Claw Clips", collectionSlugs: ["claw-clips"], image: "clip", gradient: ["#f3e6d8", "#c79a3e"], badge: "New", description: "A strong-grip claw clip trimmed with faux pearls — holds thick hair all day.", stock: 40, rating: 4.5, reviews: 27 },
  { id: "p19", slug: "tortoise-claw-clip", name: "Tortoise Claw Clip", price: 99, category: "Claw Clips", collectionSlugs: ["claw-clips"], image: "clip", gradient: ["#c79a3e", "#2b2320"], description: "Classic tortoiseshell-pattern acetate claw clip, medium size.", stock: 65, rating: 4.3, reviews: 20 },
  { id: "p20", slug: "ribbon-wrap-box", name: "Ribbon-Wrap Gift Box", price: 79, category: "Packaging", collectionSlugs: ["packaging"], image: "box", gradient: ["#e9d5c0", "#7a2b3f"], description: "Add this to any order — a rigid gift box in cream, hand-wrapped with satin ribbon.", stock: 100, rating: 4.7, reviews: 48 },
  { id: "p21", slug: "petal-note-card", name: "Petal Note Card", price: 39, category: "Packaging", collectionSlugs: ["packaging"], image: "card", gradient: ["#f1cdd2", "#77836a"], description: "A pressed-petal note card with an envelope, blank inside for your own words.", stock: 120, rating: 4.6, reviews: 33 },
  { id: "p22", slug: "twilight-anklet", name: "Twilight Anklet", price: 189, category: "Bracelets", collectionSlugs: ["bracelets"], image: "bracelet", gradient: ["#591f2e", "#c79a3e"], soldOut: true, badge: "Sold out", description: "A fine chain anklet with a single teardrop charm.", stock: 0, rating: 4.5, reviews: 19 },
  { id: "p23", slug: "star-drop-earring", name: "Star Drop Earring", price: 229, category: "Earrings", collectionSlugs: ["earrings"], image: "earring", gradient: ["#7a2b3f", "#f1cdd2"], badge: "New", description: "Single star charm drop earrings in brushed gold finish.", stock: 26, rating: 4.4, reviews: 12 },
  { id: "p24", slug: "harvest-bangle-combo", name: "Harvest Bangle Combo", price: 349, compareAt: 499, category: "Bracelets", collectionSlugs: ["bracelets", "hampers"], image: "bracelet", gradient: ["#c79a3e", "#7a2b3f"], badge: "Sale", description: "A set of four stacking bangles in warm autumn tones.", stock: 21, rating: 4.6, reviews: 37 },
];

export const homeSections: { title: string; subtitle: string; collectionSlug: string }[] = [
  { title: "Loved right now", subtitle: "What everyone's adding to cart this week", collectionSlug: "hampers" },
  { title: "For festive days", subtitle: "Jhumkas and drops built for celebration", collectionSlug: "jhumkas" },
  { title: "Everyday layers", subtitle: "Bracelets and rings you won't take off", collectionSlug: "bracelets" },
];

// ---- Admin mock data ----

export const orders: Order[] = [
  { id: "PC-1042", customer: "Ananya Verma", email: "ananya.v@example.com", date: "2026-08-14", items: 3, total: 2299, status: "Fulfilled" },
  { id: "PC-1041", customer: "Rohit Malhotra", email: "rohit.m@example.com", date: "2026-08-14", items: 1, total: 349, status: "Pending" },
  { id: "PC-1040", customer: "Simran Kaur", email: "simran.k@example.com", date: "2026-08-13", items: 2, total: 578, status: "Shipped" },
  { id: "PC-1039", customer: "Devika Rao", email: "devika.r@example.com", date: "2026-08-13", items: 4, total: 1899, status: "Fulfilled" },
  { id: "PC-1038", customer: "Kabir Shah", email: "kabir.s@example.com", date: "2026-08-12", items: 1, total: 149, status: "Refunded" },
  { id: "PC-1037", customer: "Meera Iyer", email: "meera.i@example.com", date: "2026-08-12", items: 2, total: 428, status: "Shipped" },
  { id: "PC-1036", customer: "Aarav Gupta", email: "aarav.g@example.com", date: "2026-08-11", items: 5, total: 2648, status: "Fulfilled" },
  { id: "PC-1035", customer: "Priya Nair", email: "priya.n@example.com", date: "2026-08-11", items: 1, total: 199, status: "Pending" },
];

export const customers: Customer[] = [
  { id: "c1", name: "Ananya Verma", email: "ananya.v@example.com", orders: 6, spent: 8940, joined: "2025-11-02", location: "Indore, MP" },
  { id: "c2", name: "Rohit Malhotra", email: "rohit.m@example.com", orders: 2, spent: 1198, joined: "2026-02-18", location: "Pune, MH" },
  { id: "c3", name: "Simran Kaur", email: "simran.k@example.com", orders: 9, spent: 15230, joined: "2025-06-21", location: "Delhi" },
  { id: "c4", name: "Devika Rao", email: "devika.r@example.com", orders: 4, spent: 6120, joined: "2025-09-14", location: "Bengaluru, KA" },
  { id: "c5", name: "Kabir Shah", email: "kabir.s@example.com", orders: 1, spent: 149, joined: "2026-08-01", location: "Ahmedabad, GJ" },
  { id: "c6", name: "Meera Iyer", email: "meera.i@example.com", orders: 3, spent: 2140, joined: "2026-01-09", location: "Chennai, TN" },
];

export const revenueByDay = [
  { day: "Mon", date: "2026-08-10", revenue: 18400, orders: 24 },
  { day: "Tue", date: "2026-08-11", revenue: 21200, orders: 29 },
  { day: "Wed", date: "2026-08-12", revenue: 16800, orders: 21 },
  { day: "Thu", date: "2026-08-13", revenue: 24300, orders: 33 },
  { day: "Fri", date: "2026-08-14", revenue: 31200, orders: 41 },
  { day: "Sat", date: "2026-08-15", revenue: 38900, orders: 52 },
  { day: "Sun", date: "2026-08-16", revenue: 27600, orders: 36 },
];

export const salesByCategory = [
  { category: "Hampers", value: 38 },
  { category: "Jewelry", value: 31 },
  { category: "Hair Accessories", value: 16 },
  { category: "Keychains", value: 9 },
  { category: "Packaging", value: 6 },
];

export const trafficBySource = [
  { source: "Instagram", visits: 4820 },
  { source: "Direct", visits: 3110 },
  { source: "Google", visits: 2490 },
  { source: "WhatsApp", visits: 1870 },
  { source: "Referral", visits: 640 },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCollectionBySlug(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export function getProductsByCollection(slug: string) {
  return products.filter((p) => p.collectionSlugs.includes(slug));
}
