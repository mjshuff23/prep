import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTracePlayback } from './useTracePlayback';
import { OperationTrace } from '../../ds/core/types';

describe('useTracePlayback', () => {
  const mockTrace: OperationTrace = {
    id: 't1',
    structure: 'stack',
    operation: 'push',
    input: 10,
    initialState: { items: [] },
    finalState: { items: [10] },
    complexity: { time: 'O(1)', space: 'O(1)' },
    steps: [
      { id: 's1', index: 0, title: 'Step 1', description: 'Desc 1', state: { items: [] } },
      { id: 's2', index: 1, title: 'Step 2', description: 'Desc 2', state: { items: [10] } },
    ]
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes correctly with no trace', () => {
    const { result } = renderHook(() => useTracePlayback(null));
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.hasTrace).toBe(false);
    expect(result.current.isPlaying).toBe(false);
  });

  it('initializes correctly with trace', () => {
    const { result } = renderHook(() => useTracePlayback(mockTrace));
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.hasTrace).toBe(true);
    expect(result.current.currentStep?.id).toBe('s1');
  });

  it('next() advances index', () => {
    const { result } = renderHook(() => useTracePlayback(mockTrace));
    act(() => result.current.next());
    expect(result.current.currentIndex).toBe(1);
    
    // Should not exceed bounds
    act(() => result.current.next());
    expect(result.current.currentIndex).toBe(1);
  });

  it('prev() decreases index', () => {
    const { result } = renderHook(() => useTracePlayback(mockTrace));
    act(() => result.current.next());
    act(() => result.current.prev());
    expect(result.current.currentIndex).toBe(0);
    
    // Should not exceed bounds
    act(() => result.current.prev());
    expect(result.current.currentIndex).toBe(0);
  });

  it('jumpTo() sets index within bounds', () => {
    const { result } = renderHook(() => useTracePlayback(mockTrace));
    act(() => result.current.jumpTo(1));
    expect(result.current.currentIndex).toBe(1);
    
    // Out of bounds
    act(() => result.current.jumpTo(5));
    expect(result.current.currentIndex).toBe(1);
    
    act(() => result.current.jumpTo(-2));
    expect(result.current.currentIndex).toBe(0);
  });

  it('play() automatically advances steps', () => {
    const { result } = renderHook(() => useTracePlayback(mockTrace));
    act(() => result.current.play());
    expect(result.current.isPlaying).toBe(true);
    
    // Speed is 1, so 1000ms per step
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(result.current.currentIndex).toBe(1);
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Should stop playing when reaching the end
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentIndex).toBe(1);
  });

  it('pause() stops playback', () => {
    const { result } = renderHook(() => useTracePlayback(mockTrace));
    act(() => result.current.play());
    act(() => result.current.pause());
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.isPlaying).toBe(false);
  });
});
