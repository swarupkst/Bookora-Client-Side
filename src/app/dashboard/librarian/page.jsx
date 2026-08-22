import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LibrarianDashboard() {
  const session =
    await auth.api.getSession({
      headers: await headers(),
    });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-base-200 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          Librarian Dashboard
        </h1>

        <p className="mt-2">
          Welcome,{" "}
          {session.user.name}
        </p>
      </div>
    </main>
  );
}