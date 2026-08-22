import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session =
    await auth.api.getSession({
      headers: await headers(),
    });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">
          Welcome,{" "}
          {session.user.name}
        </h1>

        <p className="mt-2 text-base-content/60">
          You are successfully
          authenticated.
        </p>
      </div>
    </main>
  );
}