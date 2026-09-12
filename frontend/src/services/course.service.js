import { apiFetch, apiUpload } from "./api";
import { normalizeCourse, queryString, unwrapItem, unwrapList } from "./normalizers";
export const courseService = {
  async getCourses(params) { return unwrapList(await apiFetch(`/api/courses${queryString(params)}`)).map(normalizeCourse); },
  async getCourseById(id) { return normalizeCourse(unwrapItem(await apiFetch(`/api/courses/${id}`), "course")); },
  async createCourse(payload) { const r = payload instanceof FormData ? await apiUpload("/api/courses", payload) : await apiFetch("/api/courses", { method: "POST", body: JSON.stringify(payload) }); return normalizeCourse(unwrapItem(r, "course")); },
  async updateCourse(id, payload) { const r = payload instanceof FormData ? await apiUpload(`/api/courses/${id}`, payload, "PUT") : await apiFetch(`/api/courses/${id}`, { method: "PUT", body: JSON.stringify(payload) }); return normalizeCourse(unwrapItem(r, "course")); },
  deleteCourse: async (id) => { await apiFetch(`/api/courses/${id}`, { method: "DELETE" }); return id; },
};
