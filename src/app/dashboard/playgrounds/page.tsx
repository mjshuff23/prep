export default function SavedPlaygroundsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Saved Playgrounds</h1>
      <p className="text-muted-foreground mb-8">Access your previously saved visualization states.</p>
      
      <div className="p-12 border border-dashed rounded-xl flex flex-col items-center justify-center text-center">
        <h2 className="text-lg font-medium mb-2">No playgrounds saved</h2>
        <p className="text-sm text-muted-foreground">When you save a trace in the playground, it will appear here.</p>
      </div>
    </div>
  );
}
