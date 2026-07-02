import React from 'react';
import Link from 'next/link';
import { Play, Trash2, Edit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Playground {
  id: string;
  name: string;
  description: string | null;
  structure: string;
  traceJson: unknown[] | null;
  updatedAt: Date;
}

interface PlaygroundCardProps {
  playground: Playground;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function PlaygroundCard({ playground, onDelete, onEdit }: PlaygroundCardProps) {
  const opCount = Array.isArray(playground.traceJson) ? playground.traceJson.length : 0;
  
  return (
    <Card className="flex flex-col h-full group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl line-clamp-1" title={playground.name}>
            {playground.name}
          </CardTitle>
          <Badge variant="secondary" className="whitespace-nowrap">
            {playground.structure}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 min-h-[40px]">
          {playground.description || 'No description provided.'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 pb-3">
        <div className="flex items-center text-sm text-muted-foreground">
          {opCount > 0 ? (
            <span>{opCount} saved operation{opCount === 1 ? '' : 's'}</span>
          ) : (
            <span>No operations saved</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Updated {new Date(playground.updatedAt).toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 border-t flex justify-between gap-2">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(playground.id)}
            title="Edit Details"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(playground.id)}
            title="Delete Playground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Link href={`/playground?id=${playground.id}`} className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80 gap-2">
          <Play className="h-4 w-4" /> Open
        </Link>
      </CardFooter>
    </Card>
  );
}
