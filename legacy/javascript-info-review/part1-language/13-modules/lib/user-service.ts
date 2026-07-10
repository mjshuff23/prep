// TS library module: exports types AND values.

export interface User {
  id: number;
  name: string;
}

export type UserId = User["id"];

export function createUser(name: string): User {
  return { id: nextId++, name };
}

let nextId = 1;

export const VERSION = "1.0.0";
