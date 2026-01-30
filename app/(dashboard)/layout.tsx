import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id");

  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 p-6 ml-64 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
