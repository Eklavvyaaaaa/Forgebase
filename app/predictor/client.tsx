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
import { MapPin, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type PredictorFormValues = z.infer<typeof predictorSchema>;

export function PredictorClient() {
  const form = useForm<PredictorFormValues>({
    resolver: zodResolver(predictorSchema),
    defaultValues: {
      rank: undefined,
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Input type="number" placeholder="e.g. 5000" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#2563EB]/90" disabled={mutation.isPending}>
                {mutation.isPending ? 'Predicting...' : 'Show Predictions'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Results Area */}
      <div className="lg:col-span-8 space-y-6">
        {!mutation.hasMutated ? (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-xl bg-secondary/10">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
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
        ) : mutation.data.length === 0 ? (
          <div className="text-center p-8 border rounded-xl bg-secondary/10">
            <h3 className="text-xl font-semibold mb-2">No matches found</h3>
            <p className="text-muted-foreground">Based on the historical data, we couldn't find colleges within this rank range. Try adjusting your rank to see possibilities.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center justify-between">
              <span>Predicted Matches <Badge variant="secondary" className="ml-2">{mutation.data.length}</Badge></span>
            </h3>
            {mutation.data.map((result: any, idx: number) => {
               const { college, confidence, cutoff } = result;
               
               let badgeClass = "bg-green-100 text-green-800 border-green-200";
               if (confidence === 'Possible') badgeClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
               if (confidence === 'Reach') badgeClass = "bg-orange-100 text-orange-800 border-orange-200";

               return (
                <Card key={idx} className="border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-lg">{college.name}</h4>
                        <Badge variant="outline" className={badgeClass}>{confidence}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {college.city}, {college.state}</span>
                        <span>{cutoff.course}</span>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Historical Cutoff ({cutoff.year}): </span>
                        <span className="font-mono font-medium">Rank {cutoff.openRank} - {cutoff.closeRank}</span>
                      </div>
                    </div>
                    <Button variant="outline" asChild className="shrink-0 group-hover:border-[#2563EB] group-hover:text-[#2563EB]">
                      <Link href={`/colleges/${college.slug}`}>
                        View College <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
