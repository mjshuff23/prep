import React from 'react';
import { Database, Trash2, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { listDatasetsForCurrentUser } from '@/server/actions';

export type DatasetItem = Awaited<ReturnType<typeof listDatasetsForCurrentUser>>[number];

interface DatasetCardProps {
  dataset: DatasetItem;
  onDelete: (id: string) => void;
  onLoad: (dataset: DatasetItem) => void;
}

export function DatasetCard({ dataset, onDelete, onLoad }: DatasetCardProps) {
  const valueCount = Array.isArray(dataset.valuesJson) ? dataset.valuesJson.length : 0;
  
  return (
    <Card className="flex flex-col h-full group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl line-clamp-1" title={dataset.name}>
            {dataset.name}
          </CardTitle>
          <Database className="h-5 w-5 text-muted-foreground shrink-0" />
        </div>
        <CardDescription className="line-clamp-2 min-h-[40px]">
          {dataset.description || 'No description provided.'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 pb-3">
        <div className="flex items-center text-sm text-muted-foreground">
          {valueCount > 0 ? (
            <span>{valueCount} item{valueCount === 1 ? '' : 's'} in dataset</span>
          ) : (
            <span>Empty dataset</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Updated {new Date(dataset.updatedAt).toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 border-t flex justify-between gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(dataset.id)}
          title="Delete Dataset"
          aria-label="Delete Dataset"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          className="gap-2"
          onClick={() => onLoad(dataset)}
        >
          <Download className="h-4 w-4" /> Use Dataset
        </Button>
      </CardFooter>
    </Card>
  );
}
