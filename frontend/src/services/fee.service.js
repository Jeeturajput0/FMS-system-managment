import { apiFetch } from "./api";
import { queryString, unwrapItem, unwrapList } from "./normalizers";
export const feeService = {
  async getFees(params) { const r = await apiFetch(`/api/fees${queryString(params)}`); return { items: unwrapList(r, "fees"), payments: unwrapList(r, "payments") }; },
  recordPayment: async ({ studentId, payload }) => unwrapItem(await apiFetch(`/api/fees/${studentId}/payments`, { method: "POST", body: JSON.stringify(payload) }), "payment"),
};
