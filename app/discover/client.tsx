'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { SwipeCard } from '@/components/swipe-card';
import { Loader2, RefreshCw, X, Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function DiscoverClient() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [exam, setExam] = useState<string>('JEE_MAIN');
  const [category, setCategory] = useState<string>('GENERAL');
  const [rank, setRank] = useState<string>('');
  
  const [colleges, setColleges] = useState<any[]>([]);
  const [savedList, setSavedList] = useState<any[]>([]);
  const [passedList, setPassedList] = useState<any[]>([]);

  useEffect(() => {
    const savedExam = localStorage.getItem('discover_exam');
    const savedRank = localStorage.getItem('discover_rank');
    const savedCategory = localStorage.getItem('discover_category');

    if (savedExam && savedRank && savedCategory) {
      setExam(savedExam);
      setRank(savedRank);
      setCategory(savedCategory);
      setIsConfigured(true);
    }
  }, []);

  const handleStartDiscover = () => {
    if (!rank) return;
    localStorage.setItem('discover_exam', exam);
    localStorage.setItem('discover_rank', rank);
    localStorage.setItem('discover_category', category);
    setIsConfigured(true);
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['discover-colleges', exam, rank, category],
    queryFn: async () => {
      const params = new URLSearchParams({ exam, rank, category });
      const res = await fetch(`/api/discover?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: isConfigured,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      // Filter out already processed colleges
      const processedIds = new Set([...savedList.map(c => c.id), ...passedList.map(c => c.id)]);
      setColleges(data.filter((c: any) => !processedIds.has(c.id)));
    }
  }, [data, savedList, passedList]);

  const saveMutation = useMutation({
    mutationFn: async (collegeId: string) => {
      await fetch(`/api/colleges/${collegeId}/save`, {
        method: 'POST',
      });
    }
  });

  const handleSwipe = (direction: 'left' | 'right', collegeId: string) => {
    const college = colleges.find(c => c.id === collegeId);
    setColleges((prev) => prev.filter((c) => c.id !== collegeId));

    if (!college) return;

    if (direction === 'right') {
      setSavedList((prev) => [...prev, college]);
      saveMutation.mutate(collegeId);
    } else {
      setPassedList((prev) => [...prev, college]);
    }
  };

  const resetConfig = () => {
    setIsConfigured(false);
  };

  if (!isConfigured) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white border rounded-2xl shadow-sm">
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Personalize Your Stack</h2>
          <p className="text-muted-foreground text-sm mt-1">Enter your details to get targeted college recommendations.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Entrance Exam</Label>
            <Select value={exam} onValueChange={setExam}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="JEE_MAIN">JEE Main</SelectItem>
                <SelectItem value="JEE_ADV">JEE Advanced</SelectItem>
                <SelectItem value="NEET">NEET</SelectItem>
                <SelectItem value="CAT">CAT</SelectItem>
                <SelectItem value="GATE">GATE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERAL">General</SelectItem>
                <SelectItem value="OBC">OBC</SelectItem>
                <SelectItem value="SC">SC</SelectItem>
                <SelectItem value="ST">ST</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Expected Rank</Label>
            <Input 
              type="number" 
              placeholder="e.g. 15000" 
              value={rank} 
              onChange={(e) => setRank(e.target.value)} 
            />
          </div>

          <Button 
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700" 
            onClick={handleStartDiscover}
            disabled={!rank}
          >
            Start Discovering
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Column: Passed */}
      <div className="hidden lg:block bg-gray-50/50 rounded-2xl border p-4 h-[600px] overflow-y-auto">
        <h3 className="font-semibold text-gray-500 mb-4 flex items-center gap-2">
          <X className="w-4 h-4" /> Passed
        </h3>
        <div className="space-y-3">
          {passedList.length === 0 && (
             <p className="text-sm text-muted-foreground text-center mt-10">No passed colleges.</p>
          )}
          {passedList.map(c => (
            <div key={c.id} className="p-3 bg-white border rounded-xl text-sm opacity-70">
              <p className="font-medium truncate">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.city}, {c.state}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Center Column: Swipe Stack */}
      <div className="lg:col-span-2 flex flex-col items-center justify-center">
        <div className="w-full flex justify-between items-center mb-6">
           <p className="text-sm font-medium text-muted-foreground">Targeting AIR {rank}</p>
           <Button variant="ghost" size="sm" onClick={resetConfig} className="text-blue-600">Edit Settings</Button>
        </div>

        <div className="relative w-full max-w-sm h-[500px] flex items-center justify-center perspective-1000">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
              <p className="text-muted-foreground font-medium">Finding targeted matches...</p>
            </div>
          ) : isError ? (
            <div className="text-center p-8 bg-red-50 text-red-600 rounded-xl border border-red-200">
              Failed to load colleges. Please try again.
            </div>
          ) : (
            <>
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
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gray-50 border border-gray-200 rounded-3xl z-0">
                  <h3 className="text-xl font-bold mb-2">Out of Matches</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    We've run out of colleges matching this rank profile.
                  </p>
                  <Button onClick={() => refetch()} className="rounded-full px-6 bg-white border hover:bg-gray-50 text-gray-900 shadow-sm flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" /> Refresh Stack
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Column: Saved */}
      <div className="hidden lg:block bg-green-50/30 rounded-2xl border border-green-100 p-4 h-[600px] overflow-y-auto">
        <h3 className="font-semibold text-green-600 mb-4 flex items-center gap-2">
          <Check className="w-4 h-4" /> Saved
        </h3>
        <div className="space-y-3">
          {savedList.length === 0 && (
             <p className="text-sm text-muted-foreground text-center mt-10">No saved colleges.</p>
          )}
          {savedList.map(c => (
            <div key={c.id} className="p-3 bg-white border border-green-200 rounded-xl text-sm shadow-sm">
              <p className="font-medium truncate text-gray-900">{c.name}</p>
              <p className="text-xs text-green-700 font-medium">{c.city}, {c.state}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile Lists (Visible only on small screens below the swiper) */}
      <div className="lg:hidden grid grid-cols-2 gap-4 w-full max-w-sm mx-auto mt-8">
        <div className="bg-gray-50 border rounded-xl p-3">
           <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Passed ({passedList.length})</h4>
           <div className="space-y-2 max-h-32 overflow-y-auto">
             {passedList.map(c => <div key={c.id} className="text-xs truncate opacity-70">{c.name}</div>)}
           </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-3">
           <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Saved ({savedList.length})</h4>
           <div className="space-y-2 max-h-32 overflow-y-auto">
             {savedList.map(c => <div key={c.id} className="text-xs truncate text-green-800">{c.name}</div>)}
           </div>
        </div>
      </div>
    </div>
  );
}
