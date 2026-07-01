import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { StructureContent } from "@/lib/content/registry";

export function StructureCard({ structure }: Readonly<{ structure: StructureContent }>) {
  return (
    <Link href={`/structures/${structure.slug}`}>
      <Card className="h-full transition-colors hover:bg-muted/50 flex flex-col cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{structure.title}</CardTitle>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardDescription className="line-clamp-2">{structure.summary}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Time: {structure.complexity.time.average.search}</Badge>
            <Badge variant="outline">Space: {structure.complexity.space}</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
