import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import "./admin.css"; // Ensure your CSS is saved in this folder

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const ADMIN_EMAIL = "rayyanabrar456@gmail.com";

  if (session?.user?.email !== ADMIN_EMAIL) {
    redirect("/");
  }

  return (
    <div className="admin-theme flex min-h-screen bg-[#0d0d0d]">
      {/* This renders your Sidebar component */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}