import { notFound } from "next/navigation";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { getStructureBySlug } from "@/lib/content/registry";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CodeTabs } from "@/features/code-catalog/CodeTabs";
import type { StructureKind } from "@/features/code-catalog/types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const structure = getStructureBySlug(slug);
  if (!structure) return {};
  return { title: `${structure.title} | DataStructs`, description: structure.summary };
}

export default async function StructureDetailPage({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  const structure = getStructureBySlug(slug);

  if (!structure) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{structure.title}</h1>
          <p className="text-muted-foreground max-w-3xl">{structure.summary}</p>
        </div>
        <Link href={`/playground?structure=${structure.slug}`} className={buttonVariants({ size: "lg", className: "gap-2 shrink-0" })}>
          <PlayCircle className="h-5 w-5" />
          Open in Playground
        </Link>
      </div>

      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent overflow-x-auto">
          <TabsTrigger value="overview" className="data-active:border-b-2 data-active:border-primary rounded-none px-4 py-3">Overview</TabsTrigger>
          <TabsTrigger value="invariants" className="data-active:border-b-2 data-active:border-primary rounded-none px-4 py-3">Invariants</TabsTrigger>
          <TabsTrigger value="operations" className="data-active:border-b-2 data-active:border-primary rounded-none px-4 py-3">Operations</TabsTrigger>
          <TabsTrigger value="complexity" className="data-active:border-b-2 data-active:border-primary rounded-none px-4 py-3">Complexity</TabsTrigger>
          <TabsTrigger value="implementation" className="data-active:border-b-2 data-active:border-primary rounded-none px-4 py-3">Implementation</TabsTrigger>
          <TabsTrigger value="exercises" className="data-active:border-b-2 data-active:border-primary rounded-none px-4 py-3">Exercises</TabsTrigger>
        </TabsList>

        <div className="mt-6 flex-1">
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mental Model</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{structure.mentalModel}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Real World Uses</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {structure.realWorldUses.map((use) => (
                    <li key={use}>{use}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Common Mistakes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {structure.commonMistakes.map((mistake) => (
                    <li key={mistake}>{mistake}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invariants">
            <Card>
              <CardHeader>
                <CardTitle>Invariants</CardTitle>
                <CardDescription>Rules that must always hold true for this data structure.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-4">
                  {structure.invariants.map((inv) => (
                    <li key={inv} className="text-lg">{inv}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="space-y-4">
            {structure.operations.map((op) => (
              <Card key={op.name}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl">{op.name}</CardTitle>
                  <span className="font-mono bg-muted px-2 py-1 rounded text-sm">{op.complexity}</span>
                </CardHeader>
                <CardContent>
                  <p>{op.description}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="complexity">
            <Card>
              <CardHeader>
                <CardTitle>Time & Space Complexity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="p-4 font-medium text-muted-foreground">Scenario</th>
                        <th className="p-4 font-medium text-muted-foreground">Access</th>
                        <th className="p-4 font-medium text-muted-foreground">Search</th>
                        <th className="p-4 font-medium text-muted-foreground">Insert</th>
                        <th className="p-4 font-medium text-muted-foreground">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4 font-medium">Average Time</td>
                        <td className="p-4 font-mono">{structure.complexity.time.average.access}</td>
                        <td className="p-4 font-mono">{structure.complexity.time.average.search}</td>
                        <td className="p-4 font-mono">{structure.complexity.time.average.insert}</td>
                        <td className="p-4 font-mono">{structure.complexity.time.average.delete}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 font-medium">Worst Time</td>
                        <td className="p-4 font-mono">{structure.complexity.time.worst.access}</td>
                        <td className="p-4 font-mono">{structure.complexity.time.worst.search}</td>
                        <td className="p-4 font-mono">{structure.complexity.time.worst.insert}</td>
                        <td className="p-4 font-mono">{structure.complexity.time.worst.delete}</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Worst Space</td>
                        <td className="p-4 font-mono" colSpan={4}>{structure.complexity.space}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="implementation">
            <CodeTabs structure={structure.slug as StructureKind} />
          </TabsContent>

          <TabsContent value="exercises">
            <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/20 border-dashed">
              <p className="text-muted-foreground">Practice exercises coming soon.</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
