'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { predictorSchema } from '@/lib/schemas';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Target, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

type PredictorFormValues = z.infer<typeof predictorSchema>;

export function PredictorClient() {
  const form = useForm<PredictorFormValues>({
    resolver: zodResolver(predictorSchema) as any,
    defaultValues: {
      exam: 'JEE_MAIN',
      category: 'GENERAL',
      rank: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: PredictorFormValues) => {
      const res = await fetch('/api/predictor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Failed to fetch predictions');
      return res.json();
    }
  });

  const onSubmit = (values: PredictorFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Sidebar */}
      <Card className="lg:col-span-4 h-fit border-[#E5E7EB] shadow-sm">
        <CardHeader>
          <CardTitle>Enter Your Details</CardTitle>
          <CardDescription>Fill in your exam details accurately</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="exam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entrance Exam</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Exam" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="JEE_MAIN">JEE Main</SelectItem>
                        <SelectItem value="JEE_ADV">JEE Advanced</SelectItem>
                        <SelectItem value="NEET">NEET</SelectItem>
                        <SelectItem value="CAT">CAT</SelectItem>
                        <SelectItem value="GATE">GATE</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>All India Rank (AIR)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 5000" 
                        {...field}
                        value={field.value || ''} 
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GENERAL">General</SelectItem>
                        <SelectItem value="OBC">OBC-NCL</SelectItem>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="ST">ST</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={mutation.isPending}>
                {mutation.isPending ? 'Predicting...' : 'Show Predictions'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Results Area */}
      <div className="lg:col-span-8 space-y-6">
        {mutation.isIdle ? (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-xl bg-secondary/10">
            <img src="/predictor-empty.png" alt="Ready to predict" className="w-64 h-auto mb-6 object-contain mix-blend-multiply" />
            <h3 className="text-xl font-semibold">Ready to Predict</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">Submit your details on the left to see the colleges you have a chance of getting into.</p>
          </div>
        ) : mutation.isPending ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="border-[#E5E7EB] shadow-sm"><CardContent className="p-6"><div className="h-16 bg-muted animate-pulse rounded" /></CardContent></Card>
            ))}
          </div>
        ) : mutation.isError ? (
          <div className="text-center p-8 text-destructive border border-destructive rounded-xl">Failed to generate predictions. Please try again.</div>
        ) : (mutation.data.dream.length === 0 && mutation.data.target.length === 0 && mutation.data.safe.length === 0) ? (
          <div className="text-center p-8 border rounded-xl bg-secondary/10">
            <h3 className="text-xl font-semibold mb-2">No matches found</h3>
            <p className="text-muted-foreground">Based on the historical data, we couldn't find colleges within this rank range. Try adjusting your rank to see possibilities.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Your Predictions</h3>
              <p className="text-muted-foreground">We have categorized your chances based on historical cutoff data.</p>
            </div>
            
            <Tabs defaultValue="target" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-secondary/30 p-1 rounded-xl">
                <TabsTrigger value="dream" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm transition-all flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Dream <Badge variant="secondary" className="ml-1 opacity-70 bg-gray-200">{mutation.data.dream.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="target" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all flex items-center gap-2">
                  <Target className="h-4 w-4" /> Target <Badge variant="secondary" className="ml-1 opacity-70 bg-gray-200">{mutation.data.target.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="safe" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm transition-all flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Safe <Badge variant="secondary" className="ml-1 opacity-70 bg-gray-200">{mutation.data.safe.length}</Badge>
                </TabsTrigger>
              </TabsList>

              {[
                { id: 'dream', title: 'Dream Colleges (Reach)', desc: 'You have a slim chance (10-20% probability) as your rank is slightly behind the historical closing rank.', data: mutation.data.dream, colorClass: 'text-orange-600', badgeClass: 'bg-orange-100 text-orange-800 border-orange-200', probability: '15%' },
                { id: 'target', title: 'Target Colleges (Good Match)', desc: 'You have a solid chance (50-70% probability) based on past trends.', data: mutation.data.target, colorClass: 'text-blue-600', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200', probability: '65%' },
                { id: 'safe', title: 'Safe Colleges (Backup)', desc: 'You have a very high chance (>90% probability) of getting in.', data: mutation.data.safe, colorClass: 'text-green-600', badgeClass: 'bg-green-100 text-green-800 border-green-200', probability: '95%' }
              ].map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="space-y-4 focus-visible:outline-none">
                  {tab.data.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-xl bg-gray-50 text-gray-500">
                      No {tab.id} options found for your rank.
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 bg-white p-4 rounded-xl border shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold ${tab.colorClass}`}>{tab.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{tab.desc}</p>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div className={`h-2.5 rounded-full ${tab.id === 'dream' ? 'bg-orange-500' : tab.id === 'target' ? 'bg-blue-500' : 'bg-green-500'}`} style={{ width: tab.probability }}></div>
                        </div>
                      </div>

                      {tab.data.map((result: any, idx: number) => {
                        const { college, cutoff } = result;
                        return (
                          <Card key={idx} className="border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow group">
                            <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="font-bold text-lg">{college.name}</h4>
                                  <Badge variant="outline" className={tab.badgeClass}>{tab.id.toUpperCase()}</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {college.city}, {college.state}</span>
                                  <span>{cutoff.course}</span>
                                </div>
                                <div className="mt-3 text-sm flex items-center gap-2">
                                  <span className="text-muted-foreground">Historical Rank Range: </span>
                                  <span className="font-mono font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-800">
                                    {cutoff.openRank} - {cutoff.closeRank}
                                  </span>
                                </div>
                              </div>
                              <Button variant="outline" asChild className="shrink-0 group-hover:border-primary group-hover:text-primary">
                                <Link href={`/colleges/${college.slug}`}>
                                  View College <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
