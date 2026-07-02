"use client";

import React, { useMemo } from 'react';
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/StatusBadge";

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

export function PlaygroundPageClient() {
  const {
    structureKind,
    changeStructure,
    resetState,
    status,
    error,
    trace,
    runOperation,
    definition
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

  const handleApplySeed = (seed: unknown[]) => resetState(seed);
  const handleResetEmpty = () => resetState();

  const isExecuting = status === 'running-operation';
  const hasError = status === 'error';

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-background">
      {/* Playground Toolbar */}
      <header className="flex-none h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="font-semibold text-lg">Playground</h1>
          <StatusBadge state={status === 'error' ? 'error' : status === 'trace-ready' ? 'active' : 'idle'} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" disabled>
            <Save className="h-4 w-4" />
            Save State
          </Button>
          <Button aria-label="Settings" variant="ghost" size="icon" disabled>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar - Controls */}
        <aside className="w-full md:w-72 flex-none border-r bg-muted/20 overflow-y-auto flex flex-col">
          <div className="p-4 border-b space-y-4">
            <div>
              <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Structure</h2>
              <StructureSelector 
                value={structureKind} 
                onChange={changeStructure} 
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

        {/* Center - Canvas */}
        <main className="flex-1 min-h-[300px] md:min-h-0 flex flex-col relative">
          <VisualizationCanvas
            step={playback.currentStep}
            adapter={activeAdapter}
            className="border-none rounded-none"
          />
        </main>

        {/* Right - Code & Trace */}
        <aside className="w-full md:w-80 flex-none border-l bg-card flex flex-col">
          <Tabs defaultValue="trace" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-2">
              <TabsTrigger value="trace">Trace</TabsTrigger>
              <TabsTrigger value="code" disabled>Code</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto flex flex-col">
              <TabsContent value="trace" className="p-0 m-0 border-none flex-1 flex flex-col h-full">
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
            </div>
          </Tabs>
        </aside>
      </div>
    </div>
  );
}
