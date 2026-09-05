import type { User, Bottle, TastingSession, FlavorTag } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api";

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  const data = await res.json();
  if (!res.ok) throw data;
  return data as T;
}

// --- Users ---
export const authMe = (token: string, username?: string) =>
  request<User>("/auth/me", { method: "POST", body: JSON.stringify({ username }) }, token);

export const getMe = (token: string) =>
  request<User>("/me", {}, token);

export const updateMe = (token: string, body: { username?: string; avatar_url?: string }) =>
  request<User>("/me", { method: "PUT", body: JSON.stringify(body) }, token);

export const deleteMe = (token: string) =>
  request<void>("/me", { method: "DELETE" }, token);

// --- Bottles ---
export const getBottles = (token: string) =>
  request<Bottle[]>("/bottles", {}, token);

export const getBottle = (token: string, bottleId: string) =>
  request<Bottle>(`/bottles/${bottleId}`, {}, token);

export const createBottle = (token: string, body: Partial<Bottle>) =>
  request<Bottle>("/bottles", { method: "POST", body: JSON.stringify(body) }, token);

export const updateBottle = (token: string, bottleId: string, body: Partial<Bottle>) =>
  request<Bottle>(`/bottles/${bottleId}`, { method: "PUT", body: JSON.stringify(body) }, token);

export const deleteBottle = (token: string, bottleId: string) =>
  request<void>(`/bottles/${bottleId}`, { method: "DELETE" }, token);

export const getBottlePhotoUploadUrl = (token: string, bottleId: string, contentType: "image/jpeg" | "image/png") =>
  request<{ upload_url: string; photo_url: string }>(
    `/bottles/${bottleId}/photo`,
    { method: "POST", body: JSON.stringify({ content_type: contentType }) },
    token
  );

// --- Tasting Sessions ---
export const getSessions = (token: string, bottleId: string) =>
  request<TastingSession[]>(`/bottles/${bottleId}/sessions`, {}, token);

export const getSession = (token: string, sessionId: string) =>
  request<TastingSession>(`/sessions/${sessionId}`, {}, token);

export const createSession = (token: string, bottleId: string, body: Partial<TastingSession> & { tag_ids?: string[] }) =>
  request<TastingSession>(`/bottles/${bottleId}/sessions`, { method: "POST", body: JSON.stringify(body) }, token);

export const updateSession = (token: string, sessionId: string, body: Partial<TastingSession> & { tag_ids?: string[] }) =>
  request<TastingSession>(`/sessions/${sessionId}`, { method: "PUT", body: JSON.stringify(body) }, token);

export const deleteSession = (token: string, sessionId: string) =>
  request<void>(`/sessions/${sessionId}`, { method: "DELETE" }, token);

// --- Flavor Tags ---
export const getTags = (token: string) =>
  request<FlavorTag[]>("/tags", {}, token);

export const createTag = (token: string, name: string) =>
  request<FlavorTag>("/tags", { method: "POST", body: JSON.stringify({ name }) }, token);

export const deleteTag = (token: string, tagId: string) =>
  request<void>(`/tags/${tagId}`, { method: "DELETE" }, token);
