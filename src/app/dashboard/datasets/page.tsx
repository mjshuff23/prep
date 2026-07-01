export default function DatasetsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Datasets</h1>
      <p className="text-muted-foreground mb-8">Manage custom data arrays, trees, and graphs for your tests.</p>
      
      <div className="p-12 border border-dashed rounded-xl flex flex-col items-center justify-center text-center">
        <h2 className="text-lg font-medium mb-2">No datasets created</h2>
        <p className="text-sm text-muted-foreground">You can create custom datasets to run through algorithms.</p>
      </div>
    </div>
  );
}
