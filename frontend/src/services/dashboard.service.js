import { apiFetch } from "./api";
import { unwrapItem } from "./normalizers";
export const dashboardService = {
  getAdminDashboard: async () => unwrapItem(await apiFetch("/api/admin/dashboard")),
  getFranchiseDashboard: async () => unwrapItem(await apiFetch("/api/portal/dashboard")),
  getTeacherDashboard: async () => unwrapItem(await apiFetch("/api/portal/dashboard")),
  getStudentDashboard: async () => unwrapItem(await apiFetch("/api/portal/dashboard")),
};
