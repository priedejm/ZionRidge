import { useQuery } from "@tanstack/react-query";
import homeAbout from "@/assets/Old Anderson/DJI_20260325145011_0005_D.JPG";
import homePartner from "@/assets/Tyger Bridge Road/DJI_20260402110123_0024_D.JPG";
import aboutBanner from "@/assets/Friendship Church Road/DJI_20260630131324_0120_D.JPG";
import raleyHeadshot from "@/assets/RaleyHeadshot.jpg";
import comingSoon from "@/assets/land-coming-soon.jpg";

// Every photo on the marketing site the admin can replace. Keys must match
// SITE_IMAGE_SLOTS in server/_common.php. `fallback` is the built-in photo
// used until (or unless) an override is uploaded.
export const SITE_IMAGE_SLOTS = {
  "home-about": {
    page: "Home",
    label: "About Zion Ridge section",
    fallback: homeAbout,
  },
  "home-partner": {
    page: "Home",
    label: "How to Partner section",
    fallback: homePartner,
  },
  "about-banner": {
    page: "About",
    label: "“Develop with us” banner",
    fallback: aboutBanner,
  },
  "team-john": {
    page: "About",
    label: "John Kanaan headshot",
    fallback: undefined,
  },
  "team-raley": {
    page: "About",
    label: "Raley Bruce headshot",
    fallback: raleyHeadshot,
  },
  "listing-placeholder": {
    page: "Projects",
    label: "Placeholder for listings without photos",
    fallback: comingSoon,
  },
} satisfies Record<string, { page: string; label: string; fallback: string | undefined }>;

export type SiteImageSlot = keyof typeof SITE_IMAGE_SLOTS;

export interface SiteImageOverride {
  url: string;
  filename: string;
}

export type SiteImageOverrides = Partial<Record<SiteImageSlot, SiteImageOverride>>;

export async function fetchSiteImages(): Promise<SiteImageOverrides> {
  const res = await fetch("/list-site-images.php");
  if (!res.ok) {
    throw new Error(`Failed to load site images (${res.status})`);
  }
  return res.json();
}

export function useSiteImageOverrides() {
  return useQuery({ queryKey: ["site-images"], queryFn: fetchSiteImages });
}

// `src(slot)` is undefined while overrides are still loading, so pages don't
// flash the built-in photo before swapping to the uploaded one. If the
// request fails, the built-in photos are used.
export function useSiteImages() {
  const { data, isPending } = useSiteImageOverrides();
  return {
    ready: !isPending,
    src: (slot: SiteImageSlot): string | undefined =>
      isPending ? undefined : (data?.[slot]?.url ?? SITE_IMAGE_SLOTS[slot].fallback),
  };
}
