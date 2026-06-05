import { DiscoverClient } from './client';

export const metadata = {
  title: 'Swipe Discover | College Discovery',
  description: 'Swipe through colleges tailored to your rank profile.',
};

export default function DiscoverPage() {
  return (
    <div className="container py-8 max-w-6xl mx-auto min-h-[calc(100vh-4rem)] flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Swipe Discover</h1>
        <p className="text-muted-foreground mt-2">Swipe right to save colleges, left to pass. Set your rank for personalized results.</p>
      </div>
      
      <div className="flex-1 w-full flex items-center justify-center">
        <DiscoverClient />
      </div>
    </div>
  );
}
