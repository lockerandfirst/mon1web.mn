function resolvePublicApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (raw && raw.length > 0) {
    return raw.replace(/\/+$/, "");
  }
  return "http://localhost:4000";
}

/** Хоосон string env → localhost:4000; эсвэл `fetch("/api/...")` нь Next руу буруу явна. */
export const API_BASE_URL = resolvePublicApiBaseUrl();

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  token?: string | null;
  body?: unknown;
  signal?: AbortSignal;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  if (!response.ok) {
    const text = await response.text();
    let detail = text || `API error: ${response.status}`;
    const trimmed = text.trimStart();
    if (trimmed.startsWith("<!") || trimmed.startsWith("<html")) {
      detail =
        response.status === 413
          ? "Хүсэлтийн хэмжээ хэт том байна. Зурагнуудыг жижигрүүлээд дахин оролдоно уу."
          : "API JSON биш хариу буцаалаа. Сервер ажиллаж байгаа эсэх, NEXT_PUBLIC_API_BASE_URL-аа шалгана уу.";
    } else {
      try {
        const parsed = JSON.parse(text) as { error?: string; message?: string };
        if (typeof parsed.error === "string") {
          detail = parsed.error;
        } else if (typeof parsed.message === "string") {
          detail = parsed.message;
        }
      } catch {
        /* keep raw */
      }
    }
    throw new Error(detail);
  }

  return (await response.json()) as T;
}
