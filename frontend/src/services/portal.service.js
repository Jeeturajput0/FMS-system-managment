import { apiFetch } from "./api";
import { unwrapItem, unwrapList } from "./normalizers";
export const portalService = {
  dashboard: async () => unwrapItem(await apiFetch("/api/portal/dashboard")),
  courses: async () => unwrapList(await apiFetch("/api/portal/courses")),
  fees: async () => unwrapList(await apiFetch("/api/portal/fees")),
  certificate: async () => unwrapItem(await apiFetch("/api/certificates/me")),
  attendance: async () => unwrapList(await apiFetch("/api/portal/attendance")),
  assignments: async () => unwrapList(await apiFetch("/api/portal/assignments")),
};
