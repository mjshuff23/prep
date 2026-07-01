import { Settings, Play, StepForward, StepBack, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function PlaygroundPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-background">
      {/* Playground Toolbar */}
      <header className="flex-none h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-lg">Playground</h1>
          <StatusBadge state="idle" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            Save State
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar - Controls */}
        <aside className="w-full md:w-64 flex-none border-r bg-muted/20 overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Operations</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="secondary">Insert Node</Button>
                <Button className="w-full justify-start" variant="secondary">Delete Node</Button>
                <Button className="w-full justify-start" variant="secondary">Search</Button>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Trace Controls</h2>
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="icon"><RotateCcw className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><StepBack className="h-4 w-4" /></Button>
              <Button variant="default" size="icon"><Play className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon"><StepForward className="h-4 w-4" /></Button>
            </div>
          </div>
        </aside>

        {/* Center - Canvas */}
        <main className="flex-1 min-h-[300px] md:min-h-0 bg-dot-pattern flex items-center justify-center relative">
          <div className="absolute inset-0 bg-background/50 pointer-events-none" />
          <div className="z-10 p-8 border-2 border-dashed rounded-xl bg-background/80 backdrop-blur-sm text-center max-w-sm">
            <p className="text-muted-foreground">Visualization Canvas Placeholder</p>
            <p className="text-xs text-muted-foreground mt-2">(React Flow will be rendered here)</p>
          </div>
        </main>

        {/* Right - Code & Trace */}
        <aside className="w-full md:w-80 flex-none border-l bg-card flex flex-col">
          <Tabs defaultValue="trace" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-2">
              <TabsTrigger value="trace">Trace</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="trace" className="p-4 mt-0 border-none">
                <h3 className="font-medium mb-4">Execution Log</h3>
                <div className="space-y-4">
                  <div className="border-l-2 border-muted pl-4 py-1">
                    <p className="text-sm">Ready to begin operations.</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="code" className="p-0 mt-0 h-full border-none flex flex-col">
                <div className="flex items-center gap-2 px-4 py-2 border-b text-sm">
                  <span className="font-semibold text-primary">TS</span>
                  <span className="text-muted-foreground">JS</span>
                  <span className="text-muted-foreground">PY</span>
                </div>
                <div className="p-4 bg-muted/30 flex-1 overflow-auto font-mono text-sm">
                  <pre className="text-muted-foreground">
                    <code>{`// Implementation code goes here`}</code>
                  </pre>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </aside>
      </div>
    </div>
  );
}
