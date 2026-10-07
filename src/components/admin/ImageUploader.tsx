import { useState, type DragEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminFetch, adminFetchJson } from "@/lib/admin";
import { prepareImageUpload } from "@/lib/prepareImageUpload";
import { cn } from "@/lib/utils";
import type { ApiListingImage } from "@/lib/listings";

interface ImageUploaderProps {
  readonly listingId: string;
  readonly images: ApiListingImage[];
}

export function ImageUploader({ listingId, images }: ImageUploaderProps) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: ["listings"] });
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("listingId", listingId);
        form.append("file", await prepareImageUpload(file));
        await adminFetch("/upload-image.php", { method: "POST", body: form });
      }
      await invalidate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleDragOver(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);
    void handleFiles(e.dataTransfer.files);
  }

  async function handleDelete(imageId: string) {
    setError(null);
    setSelectedIndex(null);
    try {
      await adminFetchJson("/delete-image.php", "POST", { listingId, imageId });
      await invalidate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function handleReorder(newOrder: ApiListingImage[]) {
    setError(null);
    try {
      await adminFetchJson("/reorder-images.php", "POST", {
        listingId,
        imageIds: newOrder.map((img) => img.id),
      });
      await invalidate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reorder failed");
    }
  }

  function swap(i: number, j: number) {
    const copy = [...images];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    void handleReorder(copy);
  }

  function handleSelect(index: number) {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      swap(selectedIndex, index);
      setSelectedIndex(null);
    }
  }

  function makeCover(index: number) {
    if (index === 0) return;
    setSelectedIndex(null);
    const copy = [...images];
    const [item] = copy.splice(index, 1);
    copy.unshift(item);
    void handleReorder(copy);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium leading-none">Photos</p>
        <Label
          htmlFor="photo-upload"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed p-6 text-center font-normal transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
          )}
        >
          <p className="text-sm text-muted-foreground">
            {uploading ? "Uploading…" : "Drag photos here, or click to browse"}
          </p>
          <Input
            id="photo-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={uploading}
            className="sr-only"
            onChange={(e) => void handleFiles(e.target.files)}
          />
        </Label>
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </div>

      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Click a photo, then click a second photo to swap their positions. Click the same
            photo again to cancel. The first photo is used as the cover image.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img, i) => (
              <div
                key={img.id}
                className={cn(
                  "overflow-hidden rounded-md border",
                  selectedIndex === i && "border-primary ring-2 ring-primary ring-offset-1",
                )}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(i)}
                  className="relative block w-full"
                >
                  <img src={img.url} alt={img.filename} className="h-28 w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      Cover
                    </span>
                  )}
                  {selectedIndex === i && (
                    <span className="absolute inset-0 flex items-center justify-center bg-primary/20">
                      <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                        Selected
                      </span>
                    </span>
                  )}
                </button>
                <div className="flex items-center justify-between gap-1 p-1">
                  {i !== 0 ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 px-1.5 text-[10px]"
                      onClick={() => makeCover(i)}
                    >
                      Make cover
                    </Button>
                  ) : (
                    <span />
                  )}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-destructive"
                    onClick={() => void handleDelete(img.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
