import {
  DataStructureDefinition,
  OperationCommand,
  OperationTrace,
  StructureKind,
  StructureState,
} from './types';
import { InvalidCommandError } from './errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDefinition = DataStructureDefinition<any, any>;

class DataStructureRegistry {
  private readonly structures: Map<StructureKind, AnyDefinition> = new Map();

  register(definition: AnyDefinition): void {
    if (this.structures.has(definition.kind)) {
      throw new Error(`Data structure '${definition.kind}' is already registered.`);
    }
    this.structures.set(definition.kind, definition);
  }

  getStructure(kind: StructureKind): AnyDefinition {
    const structure = this.structures.get(kind);
    if (!structure) {
      throw new InvalidCommandError(`Data structure '${kind}' is not registered.`);
    }
    return structure;
  }

  executeCommand(state: StructureState, command: OperationCommand<unknown>): OperationTrace {
    const structure = this.getStructure(command.structure);
    
    // Validate command payload using the structure's definition
    let validCommand: OperationCommand<unknown>;
    try {
      validCommand = structure.parseCommand(command);
    } catch (error) {
      throw new InvalidCommandError(`Invalid command payload: ${error instanceof Error ? error.message : String(error)}`, command);
    }

    return structure.applyOperation(state, validCommand);
  }
}

export const registry = new DataStructureRegistry();
