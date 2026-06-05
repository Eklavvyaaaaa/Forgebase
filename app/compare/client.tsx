'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/use-debounce';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { X, MapPin, Search } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function CompareClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [ids, setIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const idsParam = searchParams.get('ids');
    if (idsParam) {
      const parsedIds = idsParam.split(',').filter(Boolean);
      setIds(parsedIds);
    }
  }, [searchParams]);

  const updateUrl = (newIds: string[]) => {
    setIds(newIds);
    if (newIds.length > 0) {
      router.push(`${pathname}?ids=${newIds.join(',')}`);
    } else {
      router.push(pathname);
    }
  };

  const addCollege = (id: string) => {
    if (ids.length < 3 && !ids.includes(id)) {
      updateUrl([...ids, id]);
    }
    setOpen(false);
    setSearchQuery('');
  };

  const removeCollege = (idToRemove: string) => {
    updateUrl(ids.filter(id => id !== idToRemove));
  };

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['autocomplete', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return [];
      const res = await fetch(`/api/search/autocomplete?q=${debouncedSearch}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
    enabled: debouncedSearch.length >= 2
  });

  const { data: colleges, isLoading } = useQuery({
    queryKey: ['compare', ids.join(',')],
    queryFn: async () => {
      if (ids.length === 0) return [];
      const res = await fetch(`/api/colleges/compare?ids=${ids.join(',')}`);
      if (!res.ok) throw new Error('Fetch failed');
      return res.json();
    },
    enabled: ids.length > 0
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[300px] justify-start text-left font-normal" disabled={ids.length >= 3}>
              <Search className="mr-2 h-4 w-4" />
              {ids.length >= 3 ? "Maximum 3 colleges reached" : "Search to add college..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Type college name..." value={searchQuery} onValueChange={setSearchQuery} />
              <CommandList>
                {isSearching && <CommandEmpty>Searching...</CommandEmpty>}
                {!isSearching && searchResults?.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
                <CommandGroup>
                  {searchResults?.map((result: any) => (
                    <CommandItem key={result.id} value={result.name} onSelect={() => addCollege(result.id)}>
                      <div className="flex flex-col">
                        <span>{result.name}</span>
                        <span className="text-xs text-muted-foreground">{result.city}, {result.state}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((i) => <Skeleton key={i} className="h-[600px] w-full rounded-xl" />)}
        </div>
      ) : ids.length === 0 ? (
        <Card className="border-dashed shadow-none bg-secondary/10">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No colleges selected</h3>
            <p className="text-muted-foreground max-w-sm mt-2">Search and add up to 3 colleges to see a detailed side-by-side comparison.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border bg-secondary/30 min-w-[150px]">Features</th>
                {colleges?.map((college: any) => (
                  <th key={college.id} className="p-4 border bg-white min-w-[300px] align-top relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeCollege(college.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                    <h3 className="font-bold text-lg mb-1 pr-6">{college.name}</h3>
                    <p className="text-muted-foreground font-normal flex items-center gap-1"><MapPin className="h-3 w-3" />{college.city}, {college.state}</p>
                  </th>
                ))}
                {/* Empty slots if less than 3 */}
                {Array.from({ length: 3 - (colleges?.length || 0) }).map((_, i) => (
                  <th key={`empty-${i}`} className="p-4 border bg-secondary/10 min-w-[300px] text-center font-normal text-muted-foreground">
                    Empty Slot
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border font-medium bg-secondary/30">NIRF Rank</td>
                {colleges?.map((college: any) => (
                  <td key={college.id} className="p-4 border">{college.nirfRank || 'N/A'}</td>
                ))}
                {Array.from({ length: 3 - (colleges?.length || 0) }).map((_, i) => <td key={`empty-rank-${i}`} className="p-4 border bg-secondary/5"></td>)}
              </tr>
              <tr>
                <td className="p-4 border font-medium bg-secondary/30">Institution Type</td>
                {colleges?.map((college: any) => (
                  <td key={college.id} className="p-4 border">{college.type}</td>
                ))}
                {Array.from({ length: 3 - (colleges?.length || 0) }).map((_, i) => <td key={`empty-type-${i}`} className="p-4 border bg-secondary/5"></td>)}
              </tr>
              <tr>
                <td className="p-4 border font-medium bg-secondary/30">Rating</td>
                {colleges?.map((college: any) => (
                  <td key={college.id} className="p-4 border font-medium text-primary">{college.rating?.toFixed(1) || 'N/A'} / 5.0</td>
                ))}
                {Array.from({ length: 3 - (colleges?.length || 0) }).map((_, i) => <td key={`empty-rating-${i}`} className="p-4 border bg-secondary/5"></td>)}
              </tr>
              <tr>
                <td className="p-4 border font-medium bg-secondary/30">Avg Package</td>
                {colleges?.map((college: any) => (
                  <td key={college.id} className="p-4 border font-mono">{college.placements?.avgPackage ? `${college.placements.avgPackage} LPA` : 'N/A'}</td>
                ))}
                {Array.from({ length: 3 - (colleges?.length || 0) }).map((_, i) => <td key={`empty-avg-${i}`} className="p-4 border bg-secondary/5"></td>)}
              </tr>
              <tr>
                <td className="p-4 border font-medium bg-secondary/30">Highest Package</td>
                {colleges?.map((college: any) => (
                  <td key={college.id} className="p-4 border font-mono">{college.placements?.highestPackage ? `${college.placements.highestPackage} LPA` : 'N/A'}</td>
                ))}
                {Array.from({ length: 3 - (colleges?.length || 0) }).map((_, i) => <td key={`empty-high-${i}`} className="p-4 border bg-secondary/5"></td>)}
              </tr>
              <tr>
                <td className="p-4 border font-medium bg-secondary/30">Top Courses</td>
                {colleges?.map((college: any) => (
                  <td key={college.id} className="p-4 border">
                    <ul className="list-disc pl-4 space-y-1">
                      {college.courses?.slice(0, 3).map((c: any) => (
                        <li key={c.id}>{c.name} <span className="text-muted-foreground ml-1">({c.duration})</span></li>
                      ))}
                      {(!college.courses || college.courses.length === 0) && <span className="text-muted-foreground">N/A</span>}
                    </ul>
                  </td>
                ))}
                {Array.from({ length: 3 - (colleges?.length || 0) }).map((_, i) => <td key={`empty-courses-${i}`} className="p-4 border bg-secondary/5"></td>)}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
