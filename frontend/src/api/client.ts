export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

type RequestOptions = RequestInit & {
  token?: string | null;
};

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const token = options.token ?? localStorage.getItem("admin_token");
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {})
    }
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

  if (/^(?:https?:|data:|blob:)/i.test(value)) {
    return value;
  }

  const normalized = value.startsWith("/") ? value : `/${value}`;
  return `${API_ORIGIN}${normalized}`;
};

export const api = {
  get: <T>(path: string, token?: string | null) => request<T>(path, { method: "GET", token }),
  post: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined, token }),
  postForm: <T>(path: string, body: FormData, token?: string | null) =>
    request<T>(path, { method: "POST", body, token }),
  put: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined, token }),
  patch: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined, token }),
  delete: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: "DELETE", token })
};
