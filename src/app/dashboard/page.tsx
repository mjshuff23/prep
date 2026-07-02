import { requireUser } from "@/lib/auth-helpers";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground">Welcome to your dashboard, {user.name || user.email}. This area will show your recent activity and statistics.</p>
      
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="p-6 border rounded-xl bg-card">
          <h2 className="text-lg font-semibold mb-2">Recent Playgrounds</h2>
          <p className="text-sm text-muted-foreground">No recent playgrounds.</p>
        </div>
        <div className="p-6 border rounded-xl bg-card">
          <h2 className="text-lg font-semibold mb-2">My Datasets</h2>
          <p className="text-sm text-muted-foreground">No datasets saved.</p>
        </div>
      </div>
    </div>
  );
}
