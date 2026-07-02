"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PlaygroundCard } from './PlaygroundCard';
import { deletePlayground, updatePlayground } from '@/server/actions';
import { STRUCTURE_KINDS } from '@/ds/core/types';

interface Playground {
  id: string;
  name: string;
  description: string | null;
  structure: string;
  stateJson: unknown;
  traceJson: unknown[] | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function DashboardPlaygroundsClient({ initialPlaygrounds }: { initialPlaygrounds: Playground[] }) {
  const [playgrounds, setPlaygrounds] = useState<Playground[]>(initialPlaygrounds);
  const [search, setSearch] = useState('');
  const [structureFilter, setStructureFilter] = useState<string>('all');
  
  // Modals state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editPlayground, setEditPlayground] = useState<Playground | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredPlaygrounds = useMemo(() => {
    return playgrounds.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
      const matchesStructure = structureFilter === 'all' || p.structure === structureFilter;
      return matchesSearch && matchesStructure;
    });
  }, [playgrounds, search, structureFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deletePlayground(deleteId);
      setPlaygrounds(prev => prev.filter(p => p.id !== deleteId));
      toast.success('Playground deleted successfully');
    } catch (_err) {
      toast.error('Failed to delete playground');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const openEditModal = (id: string) => {
    const pg = playgrounds.find(p => p.id === id);
    if (pg) {
      setEditPlayground(pg);
      setEditName(pg.name);
      setEditDesc(pg.description || '');
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
        // Since we are only updating metadata, we leave stateJson and traceJson undefined in payload
        // so the server action preserves existing values
      });
      setPlaygrounds(prev => prev.map(p => p.id === editPlayground.id ? { ...p, ...updated } : p));
      toast.success('Playground updated successfully');
      setEditPlayground(null);
    } catch (_err) {
      toast.error('Failed to update playground');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4 w-full sm:w-auto flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search playgrounds..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={structureFilter} onValueChange={(v) => v && setStructureFilter(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Structure" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Structures</SelectItem>
              {STRUCTURE_KINDS.map(kind => (
                <SelectItem key={kind} value={kind}>{kind}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Link href="/playground" className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80 whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" /> New Playground
        </Link>
      </div>

      {filteredPlaygrounds.length === 0 ? (
        <div className="p-12 border border-dashed rounded-xl flex flex-col items-center justify-center text-center bg-muted/20">
          <h2 className="text-lg font-medium mb-2">No playgrounds found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {playgrounds.length === 0 
              ? "You haven't saved any playgrounds yet."
              : "No playgrounds match your search filters."}
          </p>
          {playgrounds.length === 0 ? (
            <Link href="/playground" className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80">
              Create Your First Playground
            </Link>
          ) : (
            <Button variant="outline" onClick={() => { setSearch(''); setStructureFilter('all'); }}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlaygrounds.map(pg => (
            <PlaygroundCard 
              key={pg.id} 
              playground={pg} 
              onDelete={setDeleteId}
              onEdit={openEditModal}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Playground</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this playground? This action cannot be undone and you will lose all saved state and operation history.
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

      {/* Edit Details Modal */}
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
    </div>
  );
}
