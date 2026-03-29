const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const json = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | { detail?: string; message?: string; success?: boolean }
    | null;

  if (!response.ok) {
    const backendMessage =
      (json && "message" in json && typeof json.message === "string" && json.message) ||
      (json && "detail" in json && typeof json.detail === "string" && json.detail) ||
      `Request failed (${response.status})`;
    throw new ApiError(backendMessage, response.status);
  }

  if (!json || !("success" in json) || !json.success) {
    const backendMessage =
      (json && "message" in json && typeof json.message === "string" && json.message) ||
      "Request failed";
    throw new ApiError(backendMessage, response.status || 500);
  }

  return json.data as T;
}

export const api = {
  get: <T>(path: string, token?: string | null) => request<T>(path, { method: "GET" }, token),
  post: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }, token),
  patch: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }, token),
};
