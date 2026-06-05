'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { SwipeCard } from '@/components/swipe-card';
import { Loader2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';

export function DiscoverClient() {
  const [colleges, setColleges] = useState<any[]>([]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['discover-colleges'],
    queryFn: async () => {
      const res = await fetch('/api/discover');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setColleges(data);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (collegeId: string) => {
      await fetch('/api/user/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId }),
      });
    }
  });

  const handleSwipe = (direction: 'left' | 'right', collegeId: string) => {
    // Remove the swiped college from the stack
    setColleges((prev) => prev.filter((c) => c.id !== collegeId));

    if (direction === 'right') {
      // Trigger a mini confetti explosion for saving
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#22c55e', '#3b82f6', '#eab308']
      });

      // Save to database
      saveMutation.mutate(collegeId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Finding your perfect matches...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8 bg-red-50 text-red-600 rounded-xl border border-red-200">
        Failed to load colleges. Please try again.
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm h-[550px] mx-auto flex items-center justify-center perspective-1000">
      <AnimatePresence>
        {colleges.map((college, i) => (
          <SwipeCard
            key={college.id}
            college={college}
            active={i === colleges.length - 1}
            onSwipe={handleSwipe}
          />
        ))}
      </AnimatePresence>

      {colleges.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl z-0">
          <h3 className="text-2xl font-bold mb-2 text-gray-800">You're all caught up!</h3>
          <p className="text-muted-foreground mb-6">
            You've swiped through all the colleges in this stack. Ready to discover more?
          </p>
          <Button onClick={() => refetch()} className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh Stack
          </Button>
        </div>
      )}
    </div>
  );
}
