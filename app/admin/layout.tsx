import Sidebar from "@/components/admin/Sidebar";

export const metadata = { title: "Admin — mini makers" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-deep">
      <Sidebar />
      <div className="lg:pl-60">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
