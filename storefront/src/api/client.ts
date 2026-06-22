export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("store_customer_token");
};

export const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers ?? {});
  const token = getStoredToken();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message: unknown }).message)
        : "Request failed";
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
};

export const resolveMediaUrl = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  if (/^(?:data:|blob:)/i.test(trimmedValue)) {
    return trimmedValue;
  }

  const normalizeRelativeMediaPath = (input: string) => {
    const slashNormalized = input.replace(/\\/g, "/");
    const apiUploadsMatch = slashNormalized.match(/(?:^|\/)api\/uploads\/.+$/i);
    if (apiUploadsMatch) {
      const [, pathFromApi] = apiUploadsMatch[0].split(/api\//i);
      return `/${pathFromApi.replace(/^\/+/, "")}`;
    }

    const uploadsMatch = slashNormalized.match(/(?:^|\/)uploads\/.+$/i);
    if (uploadsMatch) {
      return `/${uploadsMatch[0].replace(/^\/+/, "")}`;
    }

    return slashNormalized.startsWith("/") ? slashNormalized : `/${slashNormalized}`;
  };

  if (/^https?:/i.test(trimmedValue)) {
    try {
      const parsed = new URL(trimmedValue);
      if (parsed.origin !== API_ORIGIN) {
        return trimmedValue;
      }

      const normalizedPath = normalizeRelativeMediaPath(`${parsed.pathname}${parsed.search}${parsed.hash}`);
      return `${API_ORIGIN}${normalizedPath}`;
    } catch {
      return trimmedValue;
    }
  }

  const normalized = normalizeRelativeMediaPath(trimmedValue);
  return `${API_ORIGIN}${normalized}`;
};

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" })
};
