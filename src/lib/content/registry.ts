export type OperationDoc = {
  name: string;
  description: string;
  complexity: string;
};

export type ComplexityTable = {
  time: {
    average: {
      access: string;
      search: string;
      insert: string;
      delete: string;
    };
    worst: {
      access: string;
      search: string;
      insert: string;
      delete: string;
    };
  };
  space: string;
};

export type StructureContent = {
  slug: string;
  title: string;
  category: 'linear' | 'hash' | 'tree' | 'graph' | 'advanced';
  summary: string;
  mentalModel: string;
  invariants: string[];
  operations: OperationDoc[];
  complexity: ComplexityTable;
  commonMistakes: string[];
  realWorldUses: string[];
};

const makeComplexity = (
  avgAccess: string, avgSearch: string, avgInsert: string, avgDelete: string,
  worstAccess: string, worstSearch: string, worstInsert: string, worstDelete: string,
  space: string
): ComplexityTable => ({
  time: {
    average: { access: avgAccess, search: avgSearch, insert: avgInsert, delete: avgDelete },
    worst: { access: worstAccess, search: worstSearch, insert: worstInsert, delete: worstDelete },
  },
  space
});

const makeStructure = (
  slug: string, title: string, category: StructureContent['category'], summary: string, mentalModel: string,
  invariants: string[], operations: OperationDoc[], complexity: ComplexityTable, commonMistakes: string[], realWorldUses: string[]
): StructureContent => ({
  slug, title, category, summary, mentalModel, invariants, operations, complexity, commonMistakes, realWorldUses
});

export const structuresRegistry: StructureContent[] = [
  makeStructure(
    'array', 'Array', 'linear',
    'A collection of elements identified by index or key, stored in contiguous memory.',
    'Think of a row of lockers where each locker has a sequential number. You can instantly access any locker if you know its number.',
    [
      'Elements are stored in contiguous memory locations.',
      'The size of a static array cannot change after creation (though dynamic arrays resize automatically).'
    ],
    [
      { name: 'Access', description: 'Read element at a specific index.', complexity: 'O(1)' },
      { name: 'Search', description: 'Find a specific value.', complexity: 'O(n)' },
      { name: 'Insert (End)', description: 'Add a new element to the end of the array.', complexity: 'O(1) amortized' },
      { name: 'Insert (Middle)', description: 'Insert an element at a specific index, shifting subsequent elements.', complexity: 'O(n)' },
      { name: 'Delete', description: 'Remove an element and shift subsequent elements back.', complexity: 'O(n)' },
    ],
    makeComplexity('O(1)', 'O(n)', 'O(n)', 'O(n)', 'O(1)', 'O(n)', 'O(n)', 'O(n)', 'O(n)'),
    [
      'Off-by-one errors when iterating over indices.',
      'Assuming insertions in the middle of an array are fast.'
    ],
    [
      'Storing sequential data like a list of users.',
      'Implementing matrices and vectors in math libraries.',
      'Serving as the foundation for Hash Tables and Heaps.'
    ]
  ),
  makeStructure(
    'hash-table', 'Hash Table', 'hash',
    'A data structure that implements an associative array abstract data type, a structure that can map keys to values.',
    'Think of a dictionary book with tabs for each letter. You jump straight to the tab matching the first letter of your word.',
    [
      'Each key maps to exactly one value.',
      'A hash function must be deterministic (always produces the same hash for the same key).'
    ],
    [
      { name: 'Search', description: 'Look up a value by its key.', complexity: 'O(1)' },
      { name: 'Insert', description: 'Add a new key-value pair.', complexity: 'O(1)' },
      { name: 'Delete', description: 'Remove a key-value pair.', complexity: 'O(1)' },
    ],
    makeComplexity('N/A', 'O(1)', 'O(1)', 'O(1)', 'N/A', 'O(n)', 'O(n)', 'O(n)', 'O(n)'),
    [
      'Using mutable objects as keys, causing their hashes to change.',
      'Ignoring load factors and allowing too many collisions.'
    ],
    [
      'Database indexing.',
      'Caching mechanisms (like Redis).',
      'Implementing sets.'
    ]
  ),
  makeStructure(
    'binary-search-tree', 'Binary Search Tree', 'tree',
    'A node-based binary tree data structure which has the properties of a search tree.',
    'Think of a decision tree where you always ask "is it less than X?" If yes, go left. If no, go right.',
    [
      'The left subtree of a node contains only nodes with keys lesser than the node\'s key.',
      'The right subtree of a node contains only nodes with keys greater than the node\'s key.',
      'Both the left and right subtrees must also be binary search trees.'
    ],
    [
      { name: 'Search', description: 'Find a specific value by traversing left or right.', complexity: 'O(log n)' },
      { name: 'Insert', description: 'Add a new node in the correct sorted position.', complexity: 'O(log n)' },
      { name: 'Delete', description: 'Remove a node and restructure the tree if necessary.', complexity: 'O(log n)' },
    ],
    makeComplexity('O(log n)', 'O(log n)', 'O(log n)', 'O(log n)', 'O(n)', 'O(n)', 'O(n)', 'O(n)', 'O(n)'),
    [
      'Allowing the tree to become unbalanced, degrading performance to O(n).',
      'Incorrectly handling deletion of a node with two children.'
    ],
    [
      'Implementing dynamic sets and lookup tables.',
      'Used in 3D rendering to determine object visibility (BSP trees).'
    ]
  )
];

export function getStructuresByCategory() {
  const grouped = structuresRegistry.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = [];
    }
    acc[curr.category]!.push(curr);
    return acc;
  }, {} as Partial<Record<StructureContent['category'], StructureContent[]>>);
  
  return grouped;
}

export function getStructureBySlug(slug: string) {
  return structuresRegistry.find((s) => s.slug === slug);
}
