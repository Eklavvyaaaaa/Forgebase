'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, BarChart2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] relative overflow-hidden">
      <div 
        className="absolute inset-0 z-[-1] opacity-100" 
        style={{ backgroundImage: "url('/math-bg.png')", backgroundSize: '400px', backgroundRepeat: 'repeat' }}
      />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-8 py-20 lg:py-32">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 pb-2 leading-tight">
              Discover Your Dream College
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
              Explore top engineering, medical, and management institutions in India. Compare placements, analyze cutoffs, and find the perfect fit for your academic journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 flex-wrap">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-base shadow-lg transition-all cursor-pointer" asChild>
                <Link href="/colleges">
                  Explore Colleges <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base border-gray-200 hover:bg-gray-50 transition-all shadow-sm cursor-pointer" asChild>
                <Link href="/predictor">
                  Predict Rank
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto h-12 px-8 text-base transition-all shadow-sm cursor-pointer" asChild>
                <Link href="/discover">
                  Swipe Discover
                </Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex justify-end items-center relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-orange-50 rounded-full blur-3xl opacity-50 -z-10"></div>
            <img src="/landing-hero.png" alt="Diverse students exploring university campus" className="w-full max-w-lg object-contain mix-blend-multiply" />
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mt-32 text-left"
        >
          <div className="space-y-3 p-6 rounded-2xl border border-secondary bg-secondary/10 hover:bg-secondary/20 transition-colors">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Smart Search</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Filter by state, courses, and fees to find the perfect match for your requirements.
            </p>
          </div>
          <div className="space-y-3 p-6 rounded-2xl border border-secondary bg-secondary/10 hover:bg-secondary/20 transition-colors">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <BarChart2 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Compare Instantly</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Put up to 3 colleges side-by-side and evaluate their placements, rankings, and reviews.
            </p>
          </div>
          <div className="space-y-3 p-6 rounded-2xl border border-secondary bg-secondary/10 hover:bg-secondary/20 transition-colors">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg">Rank Predictor</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Use historical cutoff data from JEE, NEET, and CAT to see where you stand.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
