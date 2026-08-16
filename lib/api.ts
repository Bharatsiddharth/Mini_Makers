const API_BASE = "/api";

type Tokens = { access: string; refresh: string };

const TOKEN_KEY = "petal_tokens";

export function getTokens(): Tokens | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(TOKEN_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveTokens(tokens: Tokens) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAccessToken(): string | null {
  return getTokens()?.access ?? null;
}

export function getRefreshToken(): string | null {
  return getTokens()?.refresh ?? null;
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    saveTokens({ access: data.access, refresh: data.refresh ?? refresh });
    return true;
  } catch {
    return false;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = getAccessToken();
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    }
  }

  if (!res.ok) {
    let detail = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail || Object.values(body).flat().join(", ") || detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

/**
 * Uploads a file as multipart/form-data. Deliberately does NOT set
 * Content-Type — the browser needs to set it itself (including the
 * multipart boundary), which apiFetch's forced "application/json" header
 * would otherwise break.
 */
export async function apiUploadFile<T>(path: string, file: File, fieldName = "image"): Promise<T> {
  const token = getAccessToken();
  
  const createFormData = () => {
    const formData = new FormData();
    formData.append(fieldName, file);
    return formData;
  };

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: createFormData(),
  });

  // Handle token expiration - try to refresh and retry
  if (res.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = getAccessToken();
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers,
        body: createFormData(),
      });
    }
  }

  if (!res.ok) {
    let detail = `Upload failed with status ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail || Object.values(body).flat().join(", ") || detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  return res.json();
}

/**
 * Fetches from the API, falling back to provided mock/fallback data
 * when the API is unavailable or returns no data.
 *
 * Handles DRF paginated responses ({ count, next, previous, results })
 * by extracting the `results` array so callers always receive a plain array.
 */
export async function apiFetchWithFallback<T>(
  path: string,
  fallback: T,
  options: RequestInit = {}
): Promise<T> {
  try {
    const data = await apiFetch<T>(path, options);

    // DRF paginated response: { count, next, previous, results: [...] }
    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      "results" in (data as Record<string, unknown>)
    ) {
      const results = (data as unknown as { results: T }).results;
      // If the API returns an empty results array, fall back to mock data
      if (Array.isArray(results) && results.length === 0 && Array.isArray(fallback) && fallback.length > 0) {
        return fallback;
      }
      return results;
    }

    // If the API returns an empty array, fall back to mock data
    if (Array.isArray(data) && data.length === 0 && Array.isArray(fallback) && fallback.length > 0) {
      return fallback;
    }
    return data;
  } catch (err) {
    console.warn(`API request to ${path} failed, using fallback data:`, err);
    return fallback;
  }
}
