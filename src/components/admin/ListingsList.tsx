import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { adminFetchJson } from "@/lib/admin";
import type { ApiListing } from "@/lib/listings";

const statusBadge: Record<ApiListing["status"], string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Pending: "bg-amber-100 text-amber-800",
  Sold: "bg-slate-200 text-slate-700",
};

interface ListingsListProps {
  listings: ApiListing[];
  onEdit: (listing: ApiListing) => void;
}

export function ListingsList({ listings, onEdit }: ListingsListProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminFetchJson("/delete-listing.php", "POST", { id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["listings"] }),
  });

  if (listings.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">No listings yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Photo</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listings.map((listing) => (
          <TableRow key={listing.id}>
            <TableCell>
              {listing.images[0] ? (
                <img src={listing.images[0].url} alt="" className="h-10 w-14 rounded object-cover" />
              ) : (
                <div className="h-10 w-14 rounded bg-muted" />
              )}
            </TableCell>
            <TableCell className="font-medium">{listing.name}</TableCell>
            <TableCell>{listing.location}</TableCell>
            <TableCell>
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusBadge[listing.status]}`}>
                {listing.status}
              </span>
            </TableCell>
            <TableCell>{listing.featured ? "Yes" : ""}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-1">
                <Button size="icon" variant="ghost" onClick={() => onEdit(listing)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete {listing.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This removes the listing and all of its photos permanently. This can&rsquo;t be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(listing.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
