import { CollegesClient } from './client';

export const metadata = {
  title: 'Colleges | College Discovery Platform',
  description: 'Search and filter colleges across India',
};

export default function CollegesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore Colleges</h1>
          <p className="text-muted-foreground mt-2">Find the right college for your future from our curated list.</p>
        </div>
        <CollegesClient />
      </div>
    </div>
  );
}
