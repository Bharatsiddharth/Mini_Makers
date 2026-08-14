"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  ArrowLeft,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-white/10 bg-plum-deep px-4 py-6 text-white lg:flex">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2 font-display text-lg">
        mini makers
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-sans font-medium tracking-wide text-blush-soft">
          Admin
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-white/15 text-white" : "text-blush-soft/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
        <button className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-blush-soft/80 hover:bg-white/10 hover:text-white">
          <Settings className="h-4.5 w-4.5" strokeWidth={1.75} />
          Settings
        </button>
      </nav>

      <Link
        href="/"
        className="mt-auto flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-blush-soft/70 hover:bg-white/10 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to store
      </Link>
    </aside>
  );
}
