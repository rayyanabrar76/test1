import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import "./admin.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const rootEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "")
    .split(",")
    .map(e => e.trim());

  if (!rootEmails.includes(session?.user?.email ?? "")) {
    redirect("/");
  }

  return (
    <div className="admin-theme flex min-h-screen bg-[#0d0d0d]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}