import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  checkAdminPassword,
  clearAdminAuthed,
  isAdminAuthed,
  setAdminAuthed,
} from "@/lib/admin";
import { useAdminListings, type ApiListing } from "@/lib/listings";
import { ListingsList } from "@/components/admin/ListingsList";
import { ListingForm } from "@/components/admin/ListingForm";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin - Zion Ridge Development" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(isAdminAuthed());

  if (!authed) {
    return <PasswordGate onSuccess={() => setAuthed(true)} />;
  }

  return (
    <ListingsManager
      onLogout={() => {
        clearAdminAuthed();
        setAuthed(false);
      }}
    />
  );
}

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (checkAdminPassword(password)) {
      setAdminAuthed();
      onSuccess();
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[var(--green-dark)] px-4 text-[var(--cream)]">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-[var(--cream)]/20 p-8"
      >
        <div>
          <h1 className="font-display text-2xl font-semibold">Admin Login</h1>
          <p className="mt-1 text-sm text-[var(--cream)]/70">
            Enter the admin password to manage listings.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[var(--cream)]">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            autoFocus
            className="text-[var(--green-dark)]"
          />
          {error && <p className="text-sm text-red-400">Incorrect password.</p>}
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  );
}

function ListingsManager({ onLogout }: { onLogout: () => void }) {
  const { data, isLoading, isError } = useAdminListings();
  const [editing, setEditing] = useState<ApiListing | "new" | null>(null);
  const currentListing =
    editing && editing !== "new" ? (data?.find((l) => l.id === editing.id) ?? editing) : undefined;

  return (
    <div className="mx-auto max-w-6xl bg-[var(--green-dark)] px-5 py-16 text-[var(--cream)] sm:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Listings</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-[var(--green-dark)]"
            onClick={() => setEditing("new")}
          >
            <Plus className="h-4 w-4" /> New listing
          </Button>
          <Button variant="ghost" className="text-[var(--cream)]" onClick={onLogout}>
            Log out
          </Button>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-[var(--cream)]/20 bg-[var(--cream)] p-6 text-[var(--green-dark)]">
        {editing ? (
          <ListingForm
            listing={currentListing}
            onSaved={(saved) => setEditing(saved)}
            onCancel={() => setEditing(null)}
          />
        ) : isLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Loading…</p>
        ) : isError ? (
          <p className="py-12 text-center text-sm text-destructive">Couldn&rsquo;t load listings.</p>
        ) : (
          <ListingsList listings={data ?? []} onEdit={setEditing} />
        )}
      </div>
    </div>
  );
}
