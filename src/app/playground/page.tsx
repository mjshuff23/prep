import { PlaygroundPageClient } from '@/features/playground/PlaygroundPageClient';

import { Suspense } from 'react';

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
      <PlaygroundPageClient />
    </Suspense>
  );
}

