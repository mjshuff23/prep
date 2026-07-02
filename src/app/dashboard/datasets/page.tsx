import { listDatasetsForCurrentUser } from "@/server/actions";
import { DashboardDatasetsClient } from "@/features/dashboard/DashboardDatasetsClient";
import { requireUser } from "@/lib/auth-helpers";

export default async function DatasetsPage() {
  await requireUser();
  const datasets = await listDatasetsForCurrentUser();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Datasets</h1>
      <p className="text-muted-foreground mb-8">Manage custom data arrays, trees, and graphs for your tests.</p>
      
      <DashboardDatasetsClient initialDatasets={datasets} />
    </div>
  );
}
