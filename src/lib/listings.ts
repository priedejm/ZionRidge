import { useQuery } from "@tanstack/react-query";
import type { Project, ProjectStatus } from "@/data/projects";
import { SITE_IMAGE_SLOTS, useSiteImages } from "@/lib/siteImages";

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

export function toProject(listing: ApiListing, placeholder: string): Project {
  const urls = listing.images.map((img) => img.url);
  return {
    id: listing.id,
    name: listing.name,
    location: listing.location,
    status: listing.status,
    description: listing.description,
    image: urls[0] ?? placeholder,
    images: urls.length > 0 ? urls : undefined,
    featured: listing.featured,
    overview: listing.overview,
    highlights: listing.highlights,
    specs: listing.specs,
  };
}

export function useProjects() {
  const placeholder =
    useSiteImages().src("listing-placeholder") ?? SITE_IMAGE_SLOTS["listing-placeholder"].fallback;
  return useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
    select: (data) =>
      [...data].sort((a, b) => a.order - b.order).map((l) => toProject(l, placeholder)),
  });
}

export function useAdminListings() {
  return useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
    select: (data) => [...data].sort((a, b) => a.order - b.order),
  });
}
