import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminFetch, adminFetchJson } from "@/lib/admin";
import { prepareImageUpload } from "@/lib/prepareImageUpload";
import {
  SITE_IMAGE_SLOTS,
  useSiteImageOverrides,
  type SiteImageOverride,
  type SiteImageSlot,
} from "@/lib/siteImages";

const slots = Object.keys(SITE_IMAGE_SLOTS) as SiteImageSlot[];

export function SiteImagesManager() {
  const { data, isLoading, isError } = useSiteImageOverrides();

  if (isLoading) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Loading…</p>;
  }
  if (isError) {
    return (
      <p className="py-12 text-center text-sm text-destructive">Couldn&rsquo;t load site photos.</p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Replace the photos used around the site. Changes go live immediately. &ldquo;Restore
        original&rdquo; puts back the photo the site launched with.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => (
          <SlotCard key={slot} slot={slot} override={data?.[slot]} />
        ))}
      </div>
    </div>
  );
}

function SlotCard({ slot, override }: { slot: SiteImageSlot; override?: SiteImageOverride }) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { page, label, fallback } = SITE_IMAGE_SLOTS[slot];
  const src = override?.url ?? fallback;
  const inputId = `site-photo-${slot}`;

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await action();
      await queryClient.invalidateQueries({ queryKey: ["site-images"] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  function upload(file: File | undefined) {
    if (!file) return;
    void run(async () => {
      const form = new FormData();
      form.append("slot", slot);
      form.append("file", await prepareImageUpload(file));
      return adminFetch("/upload-site-image.php", { method: "POST", body: form });
    });
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="flex aspect-[4/3] items-center justify-center bg-muted">
        {src ? (
          <img src={src} alt={label} className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-muted-foreground">No photo yet</span>
        )}
      </div>
      <div className="space-y-3 p-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {page}
          </p>
          <p className="text-sm font-medium">{label}</p>
          {override && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              Custom: {override.filename}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" disabled={busy}>
            <Label htmlFor={inputId} className="cursor-pointer">
              {busy ? "Saving…" : "Replace photo"}
            </Label>
          </Button>
          <Input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            className="sr-only"
            onChange={(e) => {
              upload(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          {override && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() =>
                void run(() => adminFetchJson("/reset-site-image.php", "POST", { slot }))
              }
            >
              {fallback ? "Restore original" : "Remove photo"}
            </Button>
          )}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
