import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; // ✅ This is the correct way
import { redirect } from "next/navigation";
import DashboardClientWrapper from "./DashboardClientWrapper";

// ❌ THE LINE THAT WAS HERE (const prisma = new PrismaClient()) IS NOW GONE.

export default async function UserDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  try {
    const myQuotes = await prisma.quote.findMany({
      where: { 
        userId: session.user.id 
      },
      orderBy: { 
        createdAt: "desc" 
      }
    }) ?? [];

    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#E5E5E5] font-sans">
        <main className="max-w-6xl mx-auto p-6 md:p-12">
          {/* We stringify and parse to avoid "Plain Object" serialization errors in Next.js */}
          <DashboardClientWrapper 
            session={session} 
            myQuotes={JSON.parse(JSON.stringify(myQuotes))} 
          />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Database Connection Error:", error);
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <p className="text-red-500 font-mono text-xs uppercase tracking-widest">
          Critical: Database Sync Failed
        </p>
      </div>
    );
  }
}