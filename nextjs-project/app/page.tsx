import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id");

  if (!userId) {
    redirect("/login");
  }

  redirect("/dashboard");
}
