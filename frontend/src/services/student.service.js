import { apiFetch } from "./api";
import { queryString, unwrapItem, unwrapList } from "./normalizers";
export const studentService = {
  async getStudents(params) { const r = await apiFetch(`/api/students${queryString(params)}`); return { items: unwrapList(r, "students"), pagination: r.pagination ?? r.data?.pagination ?? null }; },
  async getStudentById(id) { return unwrapItem(await apiFetch(`/api/students/${id}`), "student"); },
  async createStudent(payload) { return unwrapItem(await apiFetch("/api/students", { method: "POST", body: JSON.stringify(payload) }), "student"); },
  async updateStudent(id, payload) { return unwrapItem(await apiFetch(`/api/students/${id}`, { method: "PUT", body: JSON.stringify(payload) }), "student"); },
  async deleteStudent(id) { await apiFetch(`/api/students/${id}`, { method: "DELETE" }); return id; },
  async updateStudentStatus(id, payload) { return unwrapItem(await apiFetch(`/api/students/${id}/status`, { method: "PATCH", body: JSON.stringify(payload) }), "student"); },
};
