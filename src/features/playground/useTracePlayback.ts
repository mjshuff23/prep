import { useState, useEffect, useCallback, useRef } from 'react';
import { OperationTrace } from '../../ds/core/types';

export function useTracePlayback(trace: OperationTrace | null) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x, 2x, etc. or ms interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const steps = trace?.steps || [];
  const maxIndex = Math.max(0, steps.length - 1);

  const [prevTrace, setPrevTrace] = useState(trace);
  if (trace !== prevTrace) {
    setPrevTrace(trace);
    setCurrentIndex(0);
    setIsPlaying(false);
  }

  const pause = useCallback(() => setIsPlaying(false), []);
  const play = useCallback(() => {
    if (steps.length > 0 && currentIndex < maxIndex) {
      setIsPlaying(true);
    }
  }, [currentIndex, maxIndex, steps.length]);

  const next = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const jumpTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  }, [maxIndex]);

  useEffect(() => {
    if (isPlaying) {
      const ms = 1000 / speed;
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= maxIndex) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, ms);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, maxIndex, speed]);

  return {
    currentIndex,
    currentStep: steps[currentIndex] || null,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause,
    next,
    prev,
    jumpTo,
    maxIndex,
    hasTrace: steps.length > 0
  };
}
