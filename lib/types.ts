export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAt?: number;
  category: string;
  collectionSlugs: string[];
  image: string;
  gradient: [string, string];
  badge?: "Sale" | "New" | "Bestseller" | "Sold out";
  soldOut?: boolean;
  description: string;
  stock: number;
  rating: number;
  reviews: number;
};

export type Collection = {
  slug: string;
  name: string;
  tagline: string;
  gradient: [string, string];
};

export type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: "Pending" | "Fulfilled" | "Shipped" | "Refunded";
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
  location: string;
};

// ---------- Auth types ----------

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  state: string;
  isAdmin: boolean;
  date_joined: string;
};

export type LoginResponse = {
  access: string;
  refresh: string;
  user: User;
};

export type RegisterPayload = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
};

// ---------- Cart API types ----------

export type CartItem = {
  id: number;
  product: Product;
  productId: number;
  quantity: number;
  lineTotal: number;
};

export type CartData = {
  id: number;
  items: CartItem[];
  subtotal: number;
  count: number;
};

// ---------- Analytics types ----------

export type OverviewData = {
  revenue7d: number;
  revenueDelta: number;
  orders7d: number;
  ordersDelta: number;
  aov: number;
  aovDelta: number;
  newCustomers7d: number;
  newCustomersDelta: number;
};

export type RevenueByDayPoint = {
  day: string;
  date: string;
  revenue: number;
  orders: number;
};

export type SalesByCategoryPoint = {
  category: string;
  value: number;
};

export type TrafficBySourcePoint = {
  source: string;
  visits: number;
};