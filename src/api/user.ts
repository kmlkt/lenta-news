import { fetchApi } from "./common";

export interface User {
  email: string;
  name: string;
  surname: string;
  role: "user" | "admin";
}

export async function createUser(user: User) {
  await fetchApi("POST", "users", null, user);
}

export async function getUser(token: string): Promise<User> {
  return await fetchApi("GET", "users", token);
}

export async function sendCode(email: string) {
  await fetchApi("POST", "codes", null, { email });
}

export async function login(code: string): Promise<string> {
  return (await fetchApi<{ token: string }>("POST", "sessions", null, { code })).token;
}
