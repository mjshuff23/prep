import Link from "next/link";
import { Box, Code2, PlayCircle, Save } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          <span className="block text-primary">Master Data Structures</span>
          <span className="block">through Interactive Visualizations</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground sm:text-lg md:mt-5 md:max-w-3xl">
          Learn how algorithms work under the hood. Run playground operations, watch step-by-step traces, compare implementations across languages, and save your progress.
        </p>
        <div className="mx-auto mt-10 flex max-w-sm flex-col sm:flex-row sm:max-w-none sm:justify-center gap-4">
          <Link href="/structures" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto gap-2" })}>
            <Box className="h-5 w-5" />
            Explore Structures
          </Link>
          <Link href="/playground" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto gap-2" })}>
            <PlayCircle className="h-5 w-5" />
            Try the Playground
          </Link>
        </div>
      </div>

      <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl border shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <Box className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Learn Concepts</h3>
          <p className="text-sm text-muted-foreground">Detailed notes on invariants, complexity, and mental models.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl border shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <PlayCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Run Operations</h3>
          <p className="text-sm text-muted-foreground">Watch inserts, deletes, and searches step-by-step.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl border shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <Code2 className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Read Code</h3>
          <p className="text-sm text-muted-foreground">Compare implementations across JS, TS, and Python.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl border shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <Save className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Save Work</h3>
          <p className="text-sm text-muted-foreground">Create an account to save custom datasets and trace states.</p>
        </div>
      </div>
    </div>
  );
}
