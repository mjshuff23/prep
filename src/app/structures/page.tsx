import { getStructuresByCategory } from "@/lib/content/registry";
import { StructureCard } from "@/components/ui/StructureCard";

export default function StructuresPage() {
  const groupedStructures = getStructuresByCategory();
  const categoryNames: Record<string, string> = {
    linear: "Linear Structures",
    hash: "Hash-based",
    tree: "Tree-based",
    graph: "Graph-based",
    advanced: "Advanced",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Data Structures</h1>
        <p className="text-muted-foreground">Explore, learn, and visualize different data structures.</p>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedStructures).map(([category, structures]) => (
          <section key={category}>
            <h2 className="text-2xl font-semibold tracking-tight mb-6">{categoryNames[category] || category}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {structures.map((structure) => (
                <StructureCard key={structure.slug} structure={structure} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
