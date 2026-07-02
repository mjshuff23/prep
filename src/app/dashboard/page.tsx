import { requireUser } from "@/lib/auth-helpers";
import { listPlaygroundsForCurrentUser, listDatasetsForCurrentUser } from "@/server/actions";
import { DashboardOverviewClient } from "@/features/dashboard/DashboardOverviewClient";

export default async function DashboardPage() {
  const user = await requireUser();
  const [allPlaygrounds, allDatasets] = await Promise.all([
    listPlaygroundsForCurrentUser(),
    listDatasetsForCurrentUser()
  ]);

  const playgrounds = allPlaygrounds.slice(0, 3);
  const datasets = allDatasets.slice(0, 3);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome back, {user.name || user.email}.</p>
      
      <DashboardOverviewClient 
        initialPlaygrounds={playgrounds}
        initialDatasets={datasets}
      />
    </div>
  );
}
