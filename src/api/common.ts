export const API_BASE = "https://api.lenta.elqu.ru/";

export async function fetchApi<T>(
  method: "GET" | "PUT" | "POST" | "DELETE",
  path: string,
  token: string | null,
  body?: object,
): Promise<T> {
  const headers: HeadersInit = {};
  if (body) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(API_BASE + path, {
    method: method,
    body: body ? JSON.stringify(body) : undefined,
    headers: headers,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  if (response.headers.get("Content-Type")?.includes("application/json")) {
    return (await response.json()) as T;
  }
  return undefined as T;
}
