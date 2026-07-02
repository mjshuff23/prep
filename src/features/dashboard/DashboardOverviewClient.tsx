"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Database, Plus, FolderOpen, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { PlaygroundCard, type PlaygroundItem } from './PlaygroundCard';
import { DatasetCard, type DatasetItem } from './DatasetCard';
import { deletePlayground, updatePlayground, deleteDataset } from '@/server/actions';

export function DashboardOverviewClient({ 
  initialPlaygrounds, 
  initialDatasets 
}: { 
  initialPlaygrounds: PlaygroundItem[];
  initialDatasets: DatasetItem[];
}) {
  const [playgrounds, setPlaygrounds] = useState<PlaygroundItem[]>(initialPlaygrounds.slice(0, 3));
  const [datasets, setDatasets] = useState<DatasetItem[]>(initialDatasets.slice(0, 3));
  
  // Modals state for Playgrounds
  const [deletePgId, setDeletePgId] = useState<string | null>(null);
  const [isDeletingPg, setIsDeletingPg] = useState(false);
  const [editPlayground, setEditPlayground] = useState<PlaygroundItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Modals state for Datasets
  const [deleteDsId, setDeleteDsId] = useState<string | null>(null);
  const [isDeletingDs, setIsDeletingDs] = useState(false);

  const handleDeletePlayground = async () => {
    if (!deletePgId) return;
    setIsDeletingPg(true);
    try {
      await deletePlayground(deletePgId);
      setPlaygrounds(prev => prev.filter(p => p.id !== deletePgId));
      toast.success('Playground deleted successfully');
    } catch {
      toast.error('Failed to delete playground');
    } finally {
      setIsDeletingPg(false);
      setDeletePgId(null);
    }
  };

  const handleEditSave = async () => {
    if (!editPlayground || !editName.trim()) return;
    setIsSaving(true);
    try {
      const updated = await updatePlayground({
        id: editPlayground.id,
        name: editName.trim(),
        description: editDesc.trim() || null,
        structure: editPlayground.structure,
      });
      setPlaygrounds(prev => prev.map(p => p.id === editPlayground.id ? { ...p, ...updated } : p));
      toast.success('Playground updated successfully');
      setEditPlayground(null);
    } catch {
      toast.error('Failed to update playground');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDataset = async () => {
    if (!deleteDsId) return;
    setIsDeletingDs(true);
    try {
      await deleteDataset(deleteDsId);
      setDatasets(prev => prev.filter(d => d.id !== deleteDsId));
      toast.success('Dataset deleted successfully');
    } catch {
      toast.error('Failed to delete dataset');
    } finally {
      setIsDeletingDs(false);
      setDeleteDsId(null);
    }
  };

  const handleLoadDataset = (dataset: DatasetItem) => {
    toast.info(`Dataset "${dataset.name}" can be loaded from within any Playground's Dataset Panel.`);
  };

  return (
    <div className="space-y-10">
      
      {/* Quick Start Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <Link href="/playground">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium">New Playground</h3>
                <p className="text-xs text-muted-foreground">Start fresh with any structure</p>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <Link href="/structures/array">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Code className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-medium">Arrays</h3>
                <p className="text-xs text-muted-foreground">Practice basic data lists</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <Link href="/structures/stack">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Play className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="font-medium">Stacks & Queues</h3>
                <p className="text-xs text-muted-foreground">LIFO and FIFO operations</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <Link href="/dashboard/datasets">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Database className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="font-medium">Manage Datasets</h3>
                <p className="text-xs text-muted-foreground">Setup your test cases</p>
              </CardContent>
            </Link>
          </Card>
        </div>
      </section>

      {/* Recent Playgrounds */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-semibold">Recent Playgrounds</h2>
          {playgrounds.length > 0 && (
            <Link href="/dashboard/playgrounds" className="text-sm text-primary hover:underline">View All</Link>
          )}
        </div>
        
        {playgrounds.length === 0 ? (
          <div className="p-8 border border-dashed rounded-xl flex flex-col items-center justify-center text-center bg-muted/20">
            <FolderOpen className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-4">No recent playgrounds</p>
            <Link href="/playground" className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80">
              Create One
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {playgrounds.map(pg => (
              <PlaygroundCard 
                key={pg.id} 
                playground={pg} 
                onDelete={setDeletePgId}
                onEdit={(id) => {
                  const p = playgrounds.find(x => x.id === id);
                  if (p) {
                    setEditPlayground(p);
                    setEditName(p.name);
                    setEditDesc(p.description || '');
                  }
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recent Datasets */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-semibold">Recent Datasets</h2>
          {datasets.length > 0 && (
            <Link href="/dashboard/datasets" className="text-sm text-primary hover:underline">View All</Link>
          )}
        </div>
        
        {datasets.length === 0 ? (
          <div className="p-8 border border-dashed rounded-xl flex flex-col items-center justify-center text-center bg-muted/20">
            <Database className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-4">No datasets saved</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {datasets.map(ds => (
              <DatasetCard 
                key={ds.id} 
                dataset={ds} 
                onDelete={setDeleteDsId}
                onLoad={handleLoadDataset}
              />
            ))}
          </div>
        )}
      </section>

      {/* Delete Playground Modal */}
      <Dialog open={!!deletePgId} onOpenChange={(open) => !open && setDeletePgId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Playground</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this playground? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePgId(null)} disabled={isDeletingPg}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeletePlayground} disabled={isDeletingPg}>
              {isDeletingPg ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Playground Modal */}
      <Dialog open={!!editPlayground} onOpenChange={(open) => !open && setEditPlayground(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Playground Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input 
                id="edit-name" 
                value={editName} 
                onChange={e => setEditName(e.target.value)} 
                placeholder="My Custom Stack"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-desc">Description (Optional)</Label>
              <Input 
                id="edit-desc" 
                value={editDesc} 
                onChange={e => setEditDesc(e.target.value)} 
                placeholder="Testing edge cases..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPlayground(null)} disabled={isSaving}>Cancel</Button>
            <Button onClick={handleEditSave} disabled={isSaving || !editName.trim()}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dataset Modal */}
      <Dialog open={!!deleteDsId} onOpenChange={(open) => !open && setDeleteDsId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Dataset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this dataset? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDsId(null)} disabled={isDeletingDs}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteDataset} disabled={isDeletingDs}>
              {isDeletingDs ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
