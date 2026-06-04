import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, BarChart2, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-8 py-20 lg:py-32 bg-white">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[#0A0A0A] text-balance">
            Find the right college for your future.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
            The modern way to discover, compare, and predict your chances at the top engineering, medical, and management institutions in India.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#2563EB]/90 h-12 px-8 text-base" asChild>
              <Link href="/colleges">
                Explore Colleges <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base border-[#E5E7EB]" asChild>
              <Link href="/predictor">
                Predict My Rank
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mt-32 text-left">
          <div className="space-y-3 p-6 rounded-2xl border border-secondary bg-secondary/10 hover:bg-secondary/20 transition-colors">
            <div className="h-10 w-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] mb-4">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Smart Search</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Filter by state, courses, and fees to find the perfect match for your requirements.
            </p>
          </div>
          <div className="space-y-3 p-6 rounded-2xl border border-secondary bg-secondary/10 hover:bg-secondary/20 transition-colors">
            <div className="h-10 w-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] mb-4">
              <BarChart2 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Compare Instantly</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Put up to 3 colleges side-by-side and evaluate their placements, rankings, and reviews.
            </p>
          </div>
          <div className="space-y-3 p-6 rounded-2xl border border-secondary bg-secondary/10 hover:bg-secondary/20 transition-colors">
            <div className="h-10 w-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Rank Predictor</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Use historical cutoff data from JEE, NEET, and CAT to see where you stand.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
