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
