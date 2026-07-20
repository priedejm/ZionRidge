const ADMIN_KEY = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;
const SESSION_STORAGE_KEY = "zrd-admin-authed";

export function checkAdminPassword(input: string): boolean {
  return !!ADMIN_KEY && input === ADMIN_KEY;
}

export function isAdminAuthed(): boolean {
  return sessionStorage.getItem(SESSION_STORAGE_KEY) === "1";
}

export function setAdminAuthed() {
  sessionStorage.setItem(SESSION_STORAGE_KEY, "1");
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
  headers.set("X-Admin-Key", ADMIN_KEY ?? "");
  const res = await fetch(input, { ...init, headers });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.json();
}

export async function adminFetchJson<T>(
  input: string,
  method: string,
  body: unknown,
): Promise<T> {
  return adminFetch<T>(input, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
