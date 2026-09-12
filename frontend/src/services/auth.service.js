import { apiFetch, clearAuth } from "./api";
import { unwrapItem } from "./normalizers";

export const authService = {
  async login(payload) {
    const response = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
    return { token: response.token, user: unwrapItem(response, "user") };
  },
  async register(payload) {
    const response = await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });
    return { token: response.token, user: unwrapItem(response, "user") };
  },
  async getCurrentUser() { return unwrapItem(await apiFetch("/api/auth/me"), "user"); },
  logout() { clearAuth(); },
};
