import { apiFetch } from "./api";
import { queryString, unwrapItem, unwrapList } from "./normalizers";
export const batchService = {
  getBatches: async (params) => unwrapList(await apiFetch(`/api/batches${queryString(params)}`), "batches"),
  getFranchiseBatches: async (params) => unwrapList(await apiFetch(`/api/batches/franchise/batches${queryString(params)}`), "batches"),
  getBatchById: async (id) => unwrapItem(await apiFetch(`/api/batches/${id}`), "batch"),
  createBatch: async (payload) => unwrapItem(await apiFetch("/api/batches", { method: "POST", body: JSON.stringify(payload) }), "batch"),
  updateBatch: async (id, payload) => unwrapItem(await apiFetch(`/api/batches/${id}`, { method: "PUT", body: JSON.stringify(payload) }), "batch"),
  deleteBatch: async (id) => { await apiFetch(`/api/batches/${id}`, { method: "DELETE" }); return id; },
};
