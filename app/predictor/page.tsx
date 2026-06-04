import { PredictorClient } from './client';

export const metadata = {
  title: 'Rank Predictor | College Discovery Platform',
  description: 'Predict colleges based on your entrance exam rank',
};

export default function PredictorPage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-4xl">
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">College Rank Predictor</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Enter your entrance exam rank and category to find colleges where you have a good chance of admission based on historical cutoff data.
          </p>
        </div>
        <PredictorClient />
      </div>
    </div>
  );
}
