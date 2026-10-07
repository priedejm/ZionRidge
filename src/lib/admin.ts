// The admin password lives only in server/config.php. The login screen sends
// what the user typed to /login.php to verify it, then keeps it for this tab's
// session and sends it as X-Admin-Key on every mutating request.
const SESSION_STORAGE_KEY = "zrd-admin-key";

function getStoredKey(): string | null {
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

export class InvalidPasswordError extends Error {}

export async function login(password: string): Promise<void> {
  const res = await fetch("/login.php", {
    method: "POST",
    headers: { "X-Admin-Key": password },
  });
  if (res.status === 401) {
    throw new InvalidPasswordError("Incorrect password.");
  }
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  sessionStorage.setItem(SESSION_STORAGE_KEY, password);
}

export function isAdminAuthed(): boolean {
  return !!getStoredKey();
}

export function clearAdminAuthed() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

async function parseErrorMessage(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  return body?.error ?? `Request failed (${res.status})`;
}

export async function adminFetch<T>(input: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("X-Admin-Key", getStoredKey() ?? "");
  const res = await fetch(input, { ...init, headers });
  if (res.status === 401) {
    throw new Error("Password was changed or rejected — log out and sign in again.");
  }
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.json();
}

export async function adminFetchJson<T>(input: string, method: string, body: unknown): Promise<T> {
  return adminFetch<T>(input, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
