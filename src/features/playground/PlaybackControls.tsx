import React from 'react';
import { Play, Pause, StepForward, StepBack, FastForward } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

export function PlaybackControls({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  speed,
  onSpeedChange,
  disabled
}: PlaybackControlsProps) {
  return (
    <div className="space-y-4 p-4 border rounded-md bg-card">
      <div className="flex justify-center gap-2">
        <Button 
          aria-label="Step back" 
          variant="outline" 
          size="icon" 
          onClick={onPrev}
          disabled={disabled}
        >
          <StepBack className="h-4 w-4" />
        </Button>
        
        {isPlaying ? (
          <Button 
            aria-label="Pause" 
            variant="default" 
            size="icon"
            onClick={onPause}
            disabled={disabled}
          >
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            aria-label="Play" 
            variant="default" 
            size="icon"
            onClick={onPlay}
            disabled={disabled}
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
        
        <Button 
          aria-label="Step forward" 
          variant="outline" 
          size="icon" 
          onClick={onNext}
          disabled={disabled}
        >
          <StepForward className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4 px-2">
        <FastForward className="h-4 w-4 text-muted-foreground" />
        <Slider 
          value={[speed]} 
          min={0.5} 
          max={4} 
          step={0.5} 
          onValueChange={(val) => onSpeedChange(typeof val === 'number' ? val : val[0])}
          disabled={disabled}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-8 text-right">{speed}x</span>
      </div>
    </div>
  );
}
