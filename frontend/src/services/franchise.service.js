import { apiFetch } from "./api";
import { unwrapItem, unwrapList } from "./normalizers";
export const franchiseService = {
  async getFranchises() {
    return unwrapList(await apiFetch("/api/coaching"), "coachings");
  },
  async getFranchiseById(id) {
    return unwrapItem(await apiFetch(`/api/coaching/${id}`), "coaching");
  },
  async createFranchise(payload) {
    return unwrapItem(
      await apiFetch("/api/coaching", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
      "coaching",
    );
  },
  async updateFranchise(id, payload) {
    return unwrapItem(
      await apiFetch(`/api/coaching/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
      "coaching",
    );
  },
  async deleteFranchise(id) {
    await apiFetch(`/api/coaching/${id}`, { method: "DELETE" });
    return id;
  },
};
