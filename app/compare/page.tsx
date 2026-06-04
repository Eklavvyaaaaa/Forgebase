import { CompareClient } from './client';

export const metadata = {
  title: 'Compare Colleges | College Discovery Platform',
  description: 'Compare multiple colleges side-by-side',
};

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compare Colleges</h1>
          <p className="text-muted-foreground mt-2">Evaluate up to 3 colleges side-by-side based on fees, placements, and more.</p>
        </div>
        <CompareClient />
      </div>
    </div>
  );
}
