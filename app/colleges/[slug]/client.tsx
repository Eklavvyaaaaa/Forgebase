'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, Globe, Bookmark, BookmarkCheck, Star, Award, Briefcase, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

export function CollegeDetailClient({ id }: { id: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(5);

  const { data: college, isLoading, isError } = useQuery({
    queryKey: ['college', id],
    queryFn: async () => {
      const res = await fetch(`/api/colleges/${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['college', id, 'reviews'],
    queryFn: async () => {
      const res = await fetch(`/api/colleges/${id}/reviews`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/colleges/${college?.id}/save`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to save');
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: data.saved ? "College Saved" : "College Removed",
        description: data.saved ? "Added to your saved list." : "Removed from your saved list.",
      });
      // In a real app we'd invalidate saved colleges query or update local state
    },
    onError: () => {
      toast({ title: "Error", description: "You must be logged in to save colleges.", variant: "destructive" });
    }
  });

  const reviewMutation = useMutation({
    mutationFn: async (review: { rating: number; content: string }) => {
      const res = await fetch(`/api/colleges/${college?.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      if (!res.ok) throw new Error('Failed to submit review');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Review Submitted", description: "Thank you for your feedback!" });
      setReviewContent('');
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ['college', id, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['college', id] });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not submit review. Are you logged in?", variant: "destructive" });
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !college) {
    return <div className="text-center py-20 text-destructive">Error loading college details.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 max-w-5xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0A0A0A]">{college.name}</h1>
            {college.nirfRank && (
              <Badge variant="default" className="bg-primary hover:bg-primary/90 text-sm">
                NIRF #{college.nirfRank}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-4">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {college.city}, {college.state}</span>
            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-primary text-primary" /> {college.rating?.toFixed(1) || 'N/A'} ({college.totalReviews} Reviews)</span>
            <span className="uppercase text-xs font-semibold tracking-wider bg-secondary px-2 py-1 rounded">{college.type}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            <Bookmark className="h-4 w-4 mr-2" /> Save
          </Button>
          {college.website && (
            <Button asChild className="bg-primary hover:bg-primary/90">
              <a href={college.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2" /> Website
              </a>
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6">Overview</TabsTrigger>
          <TabsTrigger value="courses" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6">Courses & Fees</TabsTrigger>
          <TabsTrigger value="placements" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6">Placements</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-in fade-in-50">
          <Card className="border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">About {college.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {college.name} is a premier {college.type.toLowerCase()} institution located in {college.city}, {college.state}. 
                It is consistently ranked among the top colleges in India, currently holding the NIRF rank of {college.nirfRank}.
                The institution offers a wide range of undergraduate and postgraduate programs.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6 animate-in fade-in-50">
          <Card className="border-[#E5E7EB] shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead className="font-semibold text-[#0A0A0A]">Course Name</TableHead>
                  <TableHead className="font-semibold text-[#0A0A0A]">Duration</TableHead>
                  <TableHead className="font-semibold text-[#0A0A0A]">Total Fees</TableHead>
                  <TableHead className="font-semibold text-[#0A0A0A]">Seats</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {college.courses?.map((course: any) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>₹{(course.totalFees / 100000).toFixed(2)} Lakhs</TableCell>
                    <TableCell>{course.seats || 'N/A'}</TableCell>
                  </TableRow>
                ))}
                {(!college.courses || college.courses.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No course data available.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="placements" className="space-y-6 animate-in fade-in-50">
          {college.placements ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-[#E5E7EB] shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Average Package
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-mono">{college.placements.avgPackage} LPA</div>
                </CardContent>
              </Card>
              <Card className="border-[#E5E7EB] shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" /> Highest Package
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-mono text-primary">{college.placements.highestPackage} LPA</div>
                </CardContent>
              </Card>
              <Card className="border-[#E5E7EB] shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" /> Placement Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-mono">{college.placements.placementRate}%</div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-3 border-[#E5E7EB] shadow-sm mt-2">
                <CardHeader>
                  <CardTitle className="text-lg">Top Recruiters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(college.placements.topRecruiters || '[]').map((recruiter: string, i: number) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1 text-sm font-medium">{recruiter}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
             <div className="text-center py-12 text-muted-foreground border rounded-lg bg-secondary/20">No placement data available.</div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-8 animate-in fade-in-50">
          <Card className="border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                        <Star className={`h-5 w-5 ${star <= rating ? 'fill-primary text-primary' : 'text-muted'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea 
                  placeholder="Share your experience..." 
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  rows={4}
                />
                <Button 
                  onClick={() => reviewMutation.mutate({ rating, content: reviewContent })}
                  disabled={reviewMutation.isPending || reviewContent.length < 10}
                  className="bg-primary hover:bg-primary/90"
                >
                  Submit Review
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="font-semibold text-xl">Student Reviews</h3>
            {isLoadingReviews ? (
              <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
            ) : reviews?.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="grid gap-4">
                {reviews?.map((review: any) => (
                  <Card key={review.id} className="border-[#E5E7EB] shadow-sm bg-secondary/10">
                    <CardHeader className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {review.user?.name?.charAt(0) || 'A'}
                          </div>
                          {review.user?.name || 'Anonymous'}
                        </div>
                        <div className="flex items-center gap-1">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted'}`} />
                           ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-foreground/90">{review.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
