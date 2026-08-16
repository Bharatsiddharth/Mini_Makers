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
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

type SidebarProps = {
  /** Whether the mobile drawer is open. Ignored at lg+ where the sidebar is always visible. */
  open?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Backdrop — mobile/tablet only, shown while the drawer is open */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 max-w-[80vw] flex-col border-r border-white/10 bg-plum-deep px-4 py-6 text-white transition-transform duration-200 ease-out lg:z-20 lg:w-60 lg:max-w-none lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-2 font-display text-lg" onClick={onClose}>
            mini makers
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-sans font-medium tracking-wide text-blush-soft">
              Admin
            </span>
          </Link>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4.5 w-4.5" strokeWidth={1.75} />
          </button>
        </div>

        {user && (
          <div className="mb-4 rounded-xl bg-white/5 px-3 py-2.5">
            <p className="truncate text-sm font-medium">
              {user.first_name} {user.last_name}
            </p>
            <p className="truncate text-xs text-blush-soft/70">{user.email}</p>
          </div>
        )}

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
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

        <div className="mt-auto flex flex-col gap-1 pt-2">
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-blush-soft/70 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-blush-soft/70 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
        </div>
      </aside>
    </>
  );
}