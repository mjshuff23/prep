import { useState, useCallback } from 'react';
import { StructureKind, StructureState, OperationTrace, OperationCommand } from '../../ds/core/types';
import { registry } from '../../ds/core/registry';

export type PlaygroundStatus = 'idle' | 'running-operation' | 'trace-ready' | 'error';

export function usePlaygroundState(initialStructure: StructureKind = 'stack') {
  const [structureKind, setStructureKind] = useState<StructureKind>(initialStructure);
  const [seed, setSeed] = useState<unknown[] | undefined>(undefined);
  
  // Initialize state based on structure definition and seed
  const [structureState, setStructureState] = useState<StructureState>(() => {
    const def = registry.getStructure(initialStructure);
    return def.createInitialState(undefined);
  });

  const [status, setStatus] = useState<PlaygroundStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [trace, setTrace] = useState<OperationTrace | null>(null);

  const resetState = useCallback((newSeed?: unknown[]) => {
    const def = registry.getStructure(structureKind);
    setStructureState(def.createInitialState(newSeed));
    setSeed(newSeed);
    setStatus('idle');
    setTrace(null);
    setError(null);
  }, [structureKind]);

  const changeStructure = useCallback((newKind: StructureKind) => {
    setStructureKind(newKind);
    const def = registry.getStructure(newKind);
    setStructureState(def.createInitialState(undefined));
    setSeed(undefined);
    setStatus('idle');
    setTrace(null);
    setError(null);
  }, []);

  const runOperation = useCallback((operation: string, payload?: unknown) => {
    setStatus('running-operation');
    setError(null);

    try {
      const command: OperationCommand<unknown> = {
        structure: structureKind,
        operation: operation as OperationCommand<unknown>['operation'],
        payload
      };

      const resultTrace = registry.executeCommand(structureState, command);
      
      setStructureState(resultTrace.finalState);
      setTrace(resultTrace);
      setStatus('trace-ready');
    } catch (err) {
      setStatus('error');
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  }, [structureKind, structureState]);

  return {
    structureKind,
    changeStructure,
    structureState,
    seed,
    resetState,
    status,
    error,
    trace,
    runOperation,
    definition: registry.getStructure(structureKind)
  };
}
