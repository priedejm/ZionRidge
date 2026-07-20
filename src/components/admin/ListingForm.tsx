import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminFetchJson } from "@/lib/admin";
import { type ApiListing } from "@/lib/listings";
import { ImageUploader } from "./ImageUploader";

const listingSchema = z.object({
  name: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  status: z.enum(["Active", "Pending", "Sold"]),
  description: z.string().min(1, "Required"),
  overview: z.string().optional(),
  featured: z.boolean(),
  highlights: z.array(z.object({ value: z.string().min(1, "Required") })),
  specs: z.array(
    z.object({ label: z.string().min(1, "Required"), value: z.string().min(1, "Required") }),
  ),
});

type ListingFormValues = z.infer<typeof listingSchema>;

function toFormValues(listing?: ApiListing): ListingFormValues {
  return {
    name: listing?.name ?? "",
    location: listing?.location ?? "",
    status: listing?.status ?? "Active",
    description: listing?.description ?? "",
    overview: listing?.overview ?? "",
    featured: listing?.featured ?? false,
    highlights: (listing?.highlights ?? []).map((value) => ({ value })),
    specs: listing?.specs ?? [],
  };
}

interface ListingFormProps {
  listing?: ApiListing;
  onSaved: (listing: ApiListing) => void;
  onCancel: () => void;
}

export function ListingForm({ listing, onSaved, onCancel }: ListingFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: toFormValues(listing),
  });

  const highlightsArray = useFieldArray({ control: form.control, name: "highlights" });
  const specsArray = useFieldArray({ control: form.control, name: "specs" });

  const mutation = useMutation({
    mutationFn: async (values: ListingFormValues) => {
      const payload = {
        name: values.name,
        location: values.location,
        status: values.status,
        description: values.description,
        overview: values.overview || undefined,
        featured: values.featured,
        highlights: values.highlights.map((h) => h.value),
        specs: values.specs,
      };
      if (listing) {
        return adminFetchJson<ApiListing>("/update-listing.php", "POST", {
          id: listing.id,
          ...payload,
        });
      }
      return adminFetchJson<ApiListing>("/create-listing.php", "POST", payload);
    },
    onSuccess: (saved) => {
      void queryClient.invalidateQueries({ queryKey: ["listings"] });
      form.reset(toFormValues(saved));
      onSaved(saved);
    },
  });

  return (
    <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...form.register("location")} />
          {form.formState.errors.location && (
            <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={form.watch("status")}
            onValueChange={(value) => form.setValue("status", value as ListingFormValues["status"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2 pb-2">
          <input id="featured" type="checkbox" className="h-4 w-4" {...form.register("featured")} />
          <Label htmlFor="featured">Featured on homepage</Label>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={2} {...form.register("description")} />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="overview">Overview</Label>
        <Textarea id="overview" rows={4} {...form.register("overview")} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Highlights</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => highlightsArray.append({ value: "" })}
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
        {highlightsArray.fields.map((field, i) => (
          <div key={field.id} className="flex gap-2">
            <Input {...form.register(`highlights.${i}.value` as const)} />
            <Button type="button" size="icon" variant="ghost" onClick={() => highlightsArray.remove(i)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Specs</Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => specsArray.append({ label: "", value: "" })}
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
        {specsArray.fields.map((field, i) => (
          <div key={field.id} className="flex gap-2">
            <Input placeholder="Label" {...form.register(`specs.${i}.label` as const)} />
            <Input placeholder="Value" {...form.register(`specs.${i}.value` as const)} />
            <Button type="button" size="icon" variant="ghost" onClick={() => specsArray.remove(i)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      {listing ? (
        <div className="border-t pt-4">
          <ImageUploader listingId={listing.id} images={listing.images} />
        </div>
      ) : (
        <p className="border-t pt-4 text-sm text-muted-foreground">
          Save this listing first, then you&rsquo;ll be able to upload photos here.
        </p>
      )}

      {mutation.isError && (
        <p className="text-sm text-destructive">
          {mutation.error instanceof Error ? mutation.error.message : "Save failed"}
        </p>
      )}

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={mutation.isPending || (!!listing && !form.formState.isDirty)}
        >
          {mutation.isPending ? "Saving…" : listing ? "Save changes" : "Create listing"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {listing ? "Close" : "Cancel"}
        </Button>
      </div>
    </form>
  );
}
