import { useQuery } from "@tanstack/react-query";
import comingSoon from "@/assets/land-coming-soon.jpg";
import type { Project, ProjectStatus } from "@/data/projects";

export interface ApiListingImage {
  id: string;
  url: string;
  filename: string;
}

export interface ApiListing {
  id: string;
  name: string;
  location: string;
  status: ProjectStatus;
  description: string;
  images: ApiListingImage[];
  featured?: boolean;
  overview?: string;
  highlights?: string[];
  specs?: { label: string; value: string }[];
  order: number;
  createdAt: string;
}

export async function fetchListings(): Promise<ApiListing[]> {
  const res = await fetch("/list-listings.php");
  if (!res.ok) {
    throw new Error(`Failed to load listings (${res.status})`);
  }
  return res.json();
}

export function toProject(listing: ApiListing): Project {
  const urls = listing.images.map((img) => img.url);
  return {
    id: listing.id,
    name: listing.name,
    location: listing.location,
    status: listing.status,
    description: listing.description,
    image: urls[0] ?? comingSoon,
    images: urls.length > 0 ? urls : undefined,
    featured: listing.featured,
    overview: listing.overview,
    highlights: listing.highlights,
    specs: listing.specs,
  };
}

export function useProjects() {
  return useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
    select: (data) => [...data].sort((a, b) => a.order - b.order).map(toProject),
  });
}

export function useAdminListings() {
  return useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
    select: (data) => [...data].sort((a, b) => a.order - b.order),
  });
}
