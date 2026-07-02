/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Settings, Save, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession, signIn } from "next-auth/react";

import { usePlaygroundState } from './usePlaygroundState';
import { useTracePlayback } from './useTracePlayback';

import { StructureSelector } from './StructureSelector';
import { DatasetPanel } from './DatasetPanel';
import { OperationPanel } from './OperationPanel';
import { TraceTimeline } from './TraceTimeline';
import { PlaybackControls } from './PlaybackControls';

import { VisualizationCanvas } from '../visualizer/VisualizationCanvas';
import { stackAdapter } from '../visualizer/adapters/stack';
import { queueAdapter } from '../visualizer/adapters/queue';
import dynamic from 'next/dynamic';
import type { StructureKind } from '../code-catalog/types';

import { createPlayground, updatePlayground, listPlaygroundsForCurrentUser, getPlaygroundById } from '@/server/actions';

const CodeTabs = dynamic(
  () => import('../code-catalog/CodeTabs').then((mod) => mod.CodeTabs),
  { 
    loading: () => <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-8">Loading code viewer...</div> 
  }
);

export function PlaygroundPageClient() {
  const { data: session } = useSession();
  
  const {
    structureKind,
    changeStructure,
    loadState,
    resetState,
    status,
    error,
    trace,
    runOperation,
    definition,
    structureState
  } = usePlaygroundState('stack');

  const playback = useTracePlayback(trace);

  const activeAdapter = useMemo(() => {
    switch (structureKind) {
      case 'stack': return stackAdapter;
      case 'queue': return queueAdapter;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      default: return stackAdapter as any;
    }
  }, [structureKind]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [playgroundName, setPlaygroundName] = useState('My Playground');
  const [playgroundDesc, setPlaygroundDesc] = useState('');
  const [currentPlaygroundId, setCurrentPlaygroundId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  type PlaygroundItem = Awaited<ReturnType<typeof listPlaygroundsForCurrentUser>>[number];
  const [playgrounds, setPlaygrounds] = useState<PlaygroundItem[]>([]);
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [isLoadingPlaygrounds, setIsLoadingPlaygrounds] = useState(false);

  // Set dirty flag when state changes unless it was just saved/loaded
  const skipDirtyRef = useRef(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => {
    if (skipDirtyRef.current) {
      skipDirtyRef.current = false;
      return;
    }
    setIsDirty(true);
  }, [structureState, trace]);

  const handleApplySeed = (seed: unknown[]) => { resetState(seed); setCurrentPlaygroundId(null); setIsDirty(true); };
  const handleResetEmpty = () => { resetState(); setCurrentPlaygroundId(null); setIsDirty(true); };

  const handleSaveClick = () => {
    if (!session?.user) {
      signIn();
      return;
    }
    
    if (currentPlaygroundId) {
      handleUpdatePlayground();
    } else {
      setSaveModalOpen(true);
    }
  };

  const handleCreatePlayground = async () => {
    setIsSaving(true);
    try {
      const res = await createPlayground({
        name: playgroundName,
        description: playgroundDesc,
        structure: structureKind,
        stateJson: structureState,
        traceJson: trace,
      });
      setCurrentPlaygroundId(res.id);
      setIsDirty(false);
      setSaveModalOpen(false);
      toast.success('Playground saved');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to save playground');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePlayground = async () => {
    if (!currentPlaygroundId) return;
    setIsSaving(true);
    try {
      await updatePlayground({
        id: currentPlaygroundId,
        structure: structureKind,
        stateJson: structureState,
        traceJson: trace,
      });
      setIsDirty(false);
      toast.success('Playground updated');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to update playground');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadClick = async () => {
    if (!session?.user) {
      signIn();
      return;
    }
    setLoadModalOpen(true);
    setIsLoadingPlaygrounds(true);
    try {
      const data = await listPlaygroundsForCurrentUser();
      setPlaygrounds(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to list playgrounds');
    } finally {
      setIsLoadingPlaygrounds(false);
    }
  };

  const handleSelectPlayground = async (id: string) => {
    try {
      const pg = await getPlaygroundById(id);
      loadState(pg.structure as any, pg.stateJson, pg.traceJson);
      setCurrentPlaygroundId(pg.id);
      setPlaygroundName(pg.name);
      setPlaygroundDesc(pg.description || '');
      setLoadModalOpen(false);
      
      skipDirtyRef.current = true;
      setIsDirty(false);
      toast.success('Playground loaded');
    } catch (e: unknown) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : 'Failed to load playground');
    }
  };

  const isExecuting = status === 'running-operation';
  const hasError = status === 'error';

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-background overflow-y-auto md:overflow-hidden">
      <header className="flex-none h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-lg">Playground {isDirty && <span className="text-muted-foreground text-sm font-normal">(Unsaved)</span>}</h1>
          <StatusBadge state={status === 'error' ? 'error' : status === 'trace-ready' ? 'active' : 'idle'} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleLoadClick} disabled={isExecuting}>
            <FolderOpen className="h-4 w-4" />
            Load
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleSaveClick} disabled={isSaving || isExecuting}>
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save State'}
          </Button>
          <Button aria-label="Settings" variant="ghost" size="icon" disabled>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <aside className="w-full md:w-72 flex-none border-r bg-muted/20 overflow-y-auto flex flex-col">
          <div className="p-4 border-b space-y-4">
            <div>
              <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Structure</h2>
              <StructureSelector 
                value={structureKind} 
                onChange={(v) => { changeStructure(v); setCurrentPlaygroundId(null); setIsDirty(true); }} 
                disabled={isExecuting || playback.isPlaying} 
              />
            </div>
            
            <div>
              <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Dataset</h2>
              <DatasetPanel 
                onApplySeed={handleApplySeed} 
                onResetEmpty={handleResetEmpty} 
                disabled={isExecuting || playback.isPlaying} 
              />
            </div>
          </div>
          
          <div className="p-4 flex-1">
            <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Operations</h2>
            <OperationPanel 
              operations={definition.getSupportedOperations()}
              onRunOperation={runOperation}
              disabled={isExecuting || playback.isPlaying}
            />
            
            {hasError && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 min-h-[300px] md:min-h-0 flex flex-col relative">
          <VisualizationCanvas
            step={playback.currentStep}
            adapter={activeAdapter}
            className="border-none rounded-none"
          />
        </main>

        <aside className="w-full md:w-[440px] flex-none border-l bg-card flex flex-col">
          <Tabs defaultValue="trace" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-2">
              <TabsTrigger value="trace">Trace</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto flex flex-col">
              <TabsContent value="trace" className="p-0 m-0 border-none flex-1 flex flex-col h-full overflow-y-auto">
                <div className="p-4 border-b">
                  <h3 className="font-medium mb-4">Playback Controls</h3>
                  <PlaybackControls
                    isPlaying={playback.isPlaying}
                    onPlay={playback.play}
                    onPause={playback.pause}
                    onNext={playback.next}
                    onPrev={playback.prev}
                    speed={playback.speed}
                    onSpeedChange={playback.setSpeed}
                    disabled={!playback.hasTrace}
                  />
                </div>
                
                <div className="p-4 flex-1 flex flex-col min-h-0">
                  <h3 className="font-medium mb-4">Execution Log</h3>
                  <TraceTimeline
                    steps={trace?.steps || []}
                    currentIndex={playback.currentIndex}
                    onSelectStep={playback.jumpTo}
                    disabled={playback.isPlaying}
                  />
                  
                  {trace && (
                    <div className="mt-4 p-3 border rounded-md text-sm bg-muted/10">
                      <div className="font-semibold text-xs text-muted-foreground mb-1 uppercase tracking-wider">Complexity</div>
                      <div>Time: {trace.complexity.time}</div>
                      <div>Space: {trace.complexity.space}</div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="code" className="p-0 m-0 border-none flex-1 flex flex-col h-full overflow-y-auto">
                <CodeTabs structure={structureKind as StructureKind} />
              </TabsContent>
            </div>
          </Tabs>
        </aside>
      </div>

      <Dialog open={saveModalOpen} onOpenChange={setSaveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Playground</DialogTitle>
            <DialogDescription>
              Name your playground so you can return to it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={playgroundName} 
                onChange={(e) => setPlaygroundName(e.target.value)} 
                placeholder="My Playground" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input 
                id="description" 
                value={playgroundDesc} 
                onChange={(e) => setPlaygroundDesc(e.target.value)} 
                placeholder="A brief description..." 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePlayground} disabled={isSaving || !playgroundName}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={loadModalOpen} onOpenChange={setLoadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load Playground</DialogTitle>
            <DialogDescription>
              Select a saved playground to load.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[300px] overflow-y-auto space-y-2">
            {isLoadingPlaygrounds ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : playgrounds.length === 0 ? (
              <p className="text-sm text-muted-foreground">No saved playgrounds found.</p>
            ) : (
              playgrounds.map(pg => (
                <button type="button" key={pg.id} className="flex flex-col text-left w-full p-3 border rounded-md hover:bg-muted/50 cursor-pointer" onClick={() => handleSelectPlayground(pg.id)}>
                  <span className="font-medium text-sm">{pg.name}</span>
                  {pg.description && <span className="text-xs text-muted-foreground">{pg.description}</span>}
                  <span className="text-xs text-muted-foreground mt-1">Structure: {pg.structure}</span>
                </button>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoadModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
