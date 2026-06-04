import { CollegeDetailClient } from './client';

export default function CollegeDetailPage({ params }: { params: { slug: string } }) {
  return <CollegeDetailClient id={params.slug} />;
}
