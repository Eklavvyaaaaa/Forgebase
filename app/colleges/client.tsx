'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, GraduationCap, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface CollegeWithCourse {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  nirfRank: number | null;
  rating: number;
  totalReviews: number;
  type: string;
  courses?: { name: string; totalFees: number }[];
}

export function CollegesClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [state, setState] = useState(searchParams.get('state') || 'all');
  const [course, setCourse] = useState(searchParams.get('course') || 'all');
  const [feesRange, setFeesRange] = useState([
    Number(searchParams.get('minFees')) || 0,
    Number(searchParams.get('maxFees')) || 5000000
  ]);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const debouncedQ = useDebounce(q, 300);
  const debouncedFees = useDebounce(feesRange, 300);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'all') {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;

    if (debouncedQ !== (searchParams.get('q') || '')) { params.set('q', debouncedQ); changed = true; }
    if (!debouncedQ) { params.delete('q'); }

    if (state !== (searchParams.get('state') || 'all')) { params.set('state', state); changed = true; }
    if (state === 'all') { params.delete('state'); }

    if (course !== (searchParams.get('course') || 'all')) { params.set('course', course); changed = true; }
    if (course === 'all') { params.delete('course'); }

    if (debouncedFees[0] !== (Number(searchParams.get('minFees')) || 0)) { params.set('minFees', String(debouncedFees[0])); changed = true; }
    if (debouncedFees[0] === 0) { params.delete('minFees'); }

    if (debouncedFees[1] !== (Number(searchParams.get('maxFees')) || 5000000)) { params.set('maxFees', String(debouncedFees[1])); changed = true; }
    if (debouncedFees[1] === 5000000) { params.delete('maxFees'); }

    if (page !== (Number(searchParams.get('page')) || 1)) { params.set('page', String(page)); changed = true; }
    if (page === 1) { params.delete('page'); }

    if (changed) {
      router.push(pathname + '?' + params.toString());
    }
  }, [debouncedQ, state, course, debouncedFees, page, pathname, router, searchParams]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['colleges', debouncedQ, state, course, debouncedFees, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedQ) params.append('q', debouncedQ);
      if (state !== 'all') params.append('state', state);
      if (course !== 'all') params.append('course', course);
      if (debouncedFees[0] > 0) params.append('minFees', String(debouncedFees[0]));
      if (debouncedFees[1] < 5000000) params.append('maxFees', String(debouncedFees[1]));
      params.append('page', String(page));

      const res = await fetch(`/api/colleges?${params.toString()}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
  });

  const handleFilterReset = () => {
    setQ('');
    setState('all');
    setCourse('all');
    setFeesRange([0, 5000000]);
    setPage(1);
    router.push(pathname);
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-1 block">State</label>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger>
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
            <SelectItem value="Karnataka">Karnataka</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
            <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Course</label>
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger>
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="B.Tech">B.Tech (Engineering)</SelectItem>
            <SelectItem value="MBBS">MBBS (Medical)</SelectItem>
            <SelectItem value="MBA">MBA (Management)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">
          Max Fees: ₹{(debouncedFees[1] / 100000).toFixed(1)} Lakhs
        </label>
        <Slider
          min={0}
          max={5000000}
          step={100000}
          value={[debouncedFees[1]]}
          onValueChange={(val) => setFeesRange([debouncedFees[0], val[0]])}
        />
      </div>
      <Button variant="outline" className="w-full" onClick={handleFilterReset}>
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Mobile Sidebar */}
      <div className="w-full md:hidden flex items-center gap-4">
        <Input 
          placeholder="Search colleges..." 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
          className="flex-1"
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Filters</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your college search</SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterSidebar />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 shrink-0 space-y-6 sticky top-20">
        <Input 
          placeholder="Search colleges..." 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
        />
        <FilterSidebar />
      </div>

      {/* Results */}
      <div className="flex-1 w-full">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-primary" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-destructive">Error loading colleges.</div>
        ) : !data || !data.data || data.data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium">No colleges found.</p>
            <p className="text-muted-foreground">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.data?.map((college: CollegeWithCourse) => (
                <Card key={college.id} className="hover:shadow-md transition-shadow group flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-lg line-clamp-2 leading-tight">
                        {college.name}
                      </CardTitle>
                      {college.nirfRank && (
                        <Badge variant="secondary" className="shrink-0">NIRF #{college.nirfRank}</Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-1 mt-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {college.city}, {college.state}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-medium">{college.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({college.totalReviews})</span>
                        </span>
                        <span className="text-muted-foreground text-xs uppercase tracking-wider">{college.type}</span>
                      </div>
                      
                      {college.courses && college.courses.length > 0 && (
                        <div className="pt-3 border-t border-primary">
                          <p className="text-sm font-medium flex items-center gap-1.5">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            {college.courses[0].name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ₹{(college.courses[0].totalFees / 100000).toFixed(2)} Lakhs
                          </p>
                        </div>
                      )}

                      <Button asChild className="w-full mt-4 group-hover:bg-primary group-hover:text-white transition-colors" variant="outline">
                        <Link href={`/colleges/${college.slug || college.id}`}>
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {data?.meta?.totalPages && data.meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button 
                  variant="outline" 
                  disabled={page === 1} 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {data?.meta?.totalPages || 1}
                </span>
                <Button 
                  variant="outline" 
                  disabled={!data?.meta || page === data.meta.totalPages} 
                  onClick={() => {
                    if (data?.meta) {
                      setPage(p => Math.min(data.meta.totalPages, p + 1))
                    }
                  }}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
