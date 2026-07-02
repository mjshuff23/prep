import { listPlaygroundsForCurrentUser } from "@/server/actions";
import { DashboardPlaygroundsClient } from "@/features/dashboard/DashboardPlaygroundsClient";
import { requireUser } from "@/lib/auth-helpers";

export default async function SavedPlaygroundsPage() {
  await requireUser();
  const playgrounds = await listPlaygroundsForCurrentUser();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Saved Playgrounds</h1>
      <p className="text-muted-foreground mb-8">Access your previously saved visualization states.</p>
      
      <DashboardPlaygroundsClient initialPlaygrounds={playgrounds} />
    </div>
  );
}
