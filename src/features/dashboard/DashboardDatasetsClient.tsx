"use client";

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { DatasetCard, type DatasetItem } from './DatasetCard';
import { deleteDataset } from '@/server/actions';

export function DashboardDatasetsClient({ initialDatasets }: { initialDatasets: DatasetItem[] }) {
  const [datasets, setDatasets] = useState<DatasetItem[]>(initialDatasets);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredDatasets = useMemo(() => {
    return datasets.filter(d => {
      return d.name.toLowerCase().includes(search.toLowerCase()) || 
             (d.description && d.description.toLowerCase().includes(search.toLowerCase()));
    });
  }, [datasets, search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const targetId = deleteId;
    setIsDeleting(true);
    try {
      await deleteDataset(targetId);
      setDatasets(prev => prev.filter(d => d.id !== targetId));
      toast.success('Dataset deleted successfully');
    } catch {
      toast.error('Failed to delete dataset');
    } finally {
      setIsDeleting(false);
      setDeleteId(prev => prev === targetId ? null : prev);
    }
  };

  const handleLoad = (dataset: DatasetItem) => {
    // Usually a dataset is loaded inside a playground. 
    // From the dashboard, this could open a modal to pick a playground, 
    // or navigate to a new playground seeded with this dataset.
    // For now, MVP: copy to clipboard or show a toast that it's available in playgrounds.
    toast.info(`Dataset "${dataset.name}" can be loaded from within any Playground's Dataset Panel.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4 w-full sm:w-auto flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search datasets..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredDatasets.length === 0 ? (
        <div className="p-12 border border-dashed rounded-xl flex flex-col items-center justify-center text-center bg-muted/20">
          <h2 className="text-lg font-medium mb-2">No datasets found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {datasets.length === 0 
              ? "You haven't saved any datasets yet."
              : "No datasets match your search."}
          </p>
          {datasets.length !== 0 && (
            <Button variant="outline" onClick={() => setSearch('')}>
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredDatasets.map(ds => (
            <DatasetCard 
              key={ds.id} 
              dataset={ds} 
              onDelete={setDeleteId}
              onLoad={handleLoad}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !isDeleting && !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Dataset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this dataset? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
