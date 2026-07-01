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

export const structuresRegistry: StructureContent[] = [
  {
    slug: 'array',
    title: 'Array',
    category: 'linear',
    summary: 'A collection of elements identified by index or key, stored in contiguous memory.',
    mentalModel: 'Think of a row of lockers where each locker has a sequential number. You can instantly access any locker if you know its number.',
    invariants: [
      'Elements are stored in contiguous memory locations.',
      'The size of a static array cannot change after creation (though dynamic arrays resize automatically).'
    ],
    operations: [
      { name: 'Access', description: 'Read element at a specific index.', complexity: 'O(1)' },
      { name: 'Search', description: 'Find a specific value.', complexity: 'O(n)' },
      { name: 'Insert (End)', description: 'Add a new element to the end of the array.', complexity: 'O(1) amortized' },
      { name: 'Insert (Middle)', description: 'Insert an element at a specific index, shifting subsequent elements.', complexity: 'O(n)' },
      { name: 'Delete', description: 'Remove an element and shift subsequent elements back.', complexity: 'O(n)' },
    ],
    complexity: {
      time: {
        average: { access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)' },
        worst: { access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)' },
      },
      space: 'O(n)',
    },
    commonMistakes: [
      'Off-by-one errors when iterating over indices.',
      'Assuming insertions in the middle of an array are fast.'
    ],
    realWorldUses: [
      'Storing sequential data like a list of users.',
      'Implementing matrices and vectors in math libraries.',
      'Serving as the foundation for Hash Tables and Heaps.'
    ]
  },
  {
    slug: 'hash-table',
    title: 'Hash Table',
    category: 'hash',
    summary: 'A data structure that implements an associative array abstract data type, a structure that can map keys to values.',
    mentalModel: 'Think of a dictionary book with tabs for each letter. You jump straight to the tab matching the first letter of your word.',
    invariants: [
      'Each key maps to exactly one value.',
      'A hash function must be deterministic (always produces the same hash for the same key).'
    ],
    operations: [
      { name: 'Search', description: 'Look up a value by its key.', complexity: 'O(1)' },
      { name: 'Insert', description: 'Add a new key-value pair.', complexity: 'O(1)' },
      { name: 'Delete', description: 'Remove a key-value pair.', complexity: 'O(1)' },
    ],
    complexity: {
      time: {
        average: { access: 'N/A', search: 'O(1)', insert: 'O(1)', delete: 'O(1)' },
        worst: { access: 'N/A', search: 'O(n)', insert: 'O(n)', delete: 'O(n)' },
      },
      space: 'O(n)'
    },
    commonMistakes: [
      'Using mutable objects as keys, causing their hashes to change.',
      'Ignoring load factors and allowing too many collisions.'
    ],
    realWorldUses: [
      'Database indexing.',
      'Caching mechanisms (like Redis).',
      'Implementing sets.'
    ]
  },
  {
    slug: 'binary-search-tree',
    title: 'Binary Search Tree',
    category: 'tree',
    summary: 'A node-based binary tree data structure which has the properties of a search tree.',
    mentalModel: 'Think of a decision tree where you always ask "is it less than X?" If yes, go left. If no, go right.',
    invariants: [
      'The left subtree of a node contains only nodes with keys lesser than the node\'s key.',
      'The right subtree of a node contains only nodes with keys greater than the node\'s key.',
      'Both the left and right subtrees must also be binary search trees.'
    ],
    operations: [
      { name: 'Search', description: 'Find a specific value by traversing left or right.', complexity: 'O(log n)' },
      { name: 'Insert', description: 'Add a new node in the correct sorted position.', complexity: 'O(log n)' },
      { name: 'Delete', description: 'Remove a node and restructure the tree if necessary.', complexity: 'O(log n)' },
    ],
    complexity: {
      time: {
        average: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)' },
        worst: { access: 'O(n)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)' },
      },
      space: 'O(n)'
    },
    commonMistakes: [
      'Allowing the tree to become unbalanced, degrading performance to O(n).',
      'Incorrectly handling deletion of a node with two children.'
    ],
    realWorldUses: [
      'Implementing dynamic sets and lookup tables.',
      'Used in 3D rendering to determine object visibility (BSP trees).'
    ]
  }
];

export function getStructuresByCategory() {
  const grouped = structuresRegistry.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = [];
    }
    acc[curr.category].push(curr);
    return acc;
  }, {} as Partial<Record<StructureContent['category'], StructureContent[]>>);
  
  return grouped;
}

export function getStructureBySlug(slug: string) {
  return structuresRegistry.find((s) => s.slug === slug);
}
