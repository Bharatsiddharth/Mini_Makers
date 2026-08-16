"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Close the mobile drawer automatically whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading || !user || !user.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-deep">
        <Loader2 className="h-8 w-8 animate-spin text-plum" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-deep">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile-only top bar: hamburger trigger + brand, sticky above page content */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-plum/10 bg-cream-deep/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-plum/15 bg-white"
          aria-label="Open menu"
        >
          <Menu className="h-4.5 w-4.5 text-plum" strokeWidth={1.75} />
        </button>
        <span className="font-display text-base text-ink">
          mini makers
          <span className="ml-1.5 rounded-full bg-plum/10 px-2 py-0.5 text-[10px] font-sans font-medium tracking-wide text-plum">
            Admin
          </span>
        </span>
      </div>

      <div className="lg:pl-60">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</div>
      </div>
    </div>
  );
}