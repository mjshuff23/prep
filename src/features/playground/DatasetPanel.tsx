/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession, signIn } from "next-auth/react";
import { createDataset, listDatasetsForCurrentUser } from '@/server/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface DatasetPanelProps {
  onApplySeed: (seed: unknown[]) => void;
  onResetEmpty: () => void;
  disabled?: boolean;
}

export function DatasetPanel({ onApplySeed, onResetEmpty, disabled }: DatasetPanelProps) {
  const { data: session } = useSession();
  const [seedInput, setSeedInput] = useState('');
  
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [datasetName, setDatasetName] = useState('My Dataset');
  const [datasetDesc, setDatasetDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [datasets, setDatasets] = useState<Array<{ id: string; name: string; description: string | null; structure: string | null; valuesJson: unknown }>>([]);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(false);

  const loadDatasets = async () => {
    setIsLoadingDatasets(true);
    try {
      const data = await listDatasetsForCurrentUser();
      setDatasets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingDatasets(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      loadDatasets();
    }
  }, [session]);

  const parsedValues = seedInput.split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => {
      const num = Number(s);
      return isNaN(num) ? s : num;
    });

  const handleApply = () => {
    onApplySeed(parsedValues);
  };

  const handleSaveClick = () => {
    if (!session?.user) {
      signIn();
      return;
    }
    setSaveModalOpen(true);
  };

  const handleSaveDataset = async () => {
    setIsSaving(true);
    try {
      await createDataset({
        name: datasetName,
        description: datasetDesc,
        valuesJson: parsedValues,
      });
      setSaveModalOpen(false);
      toast.success('Dataset saved');
      loadDatasets();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to save dataset');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectDataset = (id: string | null) => {
    if (!id) return;
    const ds = datasets.find(d => d.id === id);
    if (ds && Array.isArray(ds.valuesJson)) {
      setSeedInput(ds.valuesJson.join(', '));
      onApplySeed(ds.valuesJson);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input 
          placeholder="e.g. 1, 2, 3" 
          value={seedInput} 
          onChange={(e) => setSeedInput(e.target.value)} 
          disabled={disabled}
        />
        <Button onClick={handleApply} disabled={disabled || parsedValues.length === 0}>
          Set
        </Button>
      </div>
      
      {session?.user && datasets.length > 0 && (
        <Select onValueChange={handleSelectDataset} disabled={disabled || isLoadingDatasets}>
          <SelectTrigger>
            <SelectValue placeholder="Load saved dataset..." />
          </SelectTrigger>
          <SelectContent>
            {datasets.map(ds => (
              <SelectItem key={ds.id} value={ds.id}>{ds.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onResetEmpty} disabled={disabled}>
          Empty
        </Button>
        <Button variant="secondary" className="flex-1" onClick={handleSaveClick} disabled={disabled || parsedValues.length === 0}>
          Save
        </Button>
      </div>

      <Dialog open={saveModalOpen} onOpenChange={setSaveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Dataset</DialogTitle>
            <DialogDescription>
              Save these seed values to reuse them later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dataset-name">Name</Label>
              <Input 
                id="dataset-name" 
                value={datasetName} 
                onChange={(e) => setDatasetName(e.target.value)} 
                placeholder="My Dataset" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataset-desc">Description (optional)</Label>
              <Input 
                id="dataset-desc" 
                value={datasetDesc} 
                onChange={(e) => setDatasetDesc(e.target.value)} 
                placeholder="A brief description..." 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDataset} disabled={isSaving || !datasetName}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
