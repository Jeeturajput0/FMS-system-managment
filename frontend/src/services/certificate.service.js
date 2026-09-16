import { apiFetch } from "../utils/api";

/**
 * Certificate API — mirrors backend/routes/certificate.routes.js
 * (single place for all certificate calls; no duplication in components)
 */
export const certificateService = {
  /** Staff view: fetch student + eligibility + certificate (existing or auto-created). */
  getByStudent(studentId) {
    return apiFetch(`/api/certificates/student/${studentId}`);
  },

  /** Student self view. */
  getMine() {
    return apiFetch("/api/certificates/me");
  },

  /** SUPER_ADMIN: set completion date, optionally force-issue. */
  setCompletion(studentId, payload) {
    return apiFetch(`/api/certificates/student/${studentId}/completion`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /** SUPER_ADMIN: revoke ({status:"REVOKED"}) or restore ({status:"ACTIVE"}). */
  revoke(certificateNumber, status = "REVOKED") {
    return apiFetch(`/api/certificates/${certificateNumber}/revoke`, {
      method: "POST",
      body: JSON.stringify({ status }),
    });
  },

  /** Management list (SUPER_ADMIN, ADMIN). */
  list(params = {}) {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    if (params.status) qs.set("status", params.status);
    if (params.page) qs.set("page", params.page);
    if (params.limit) qs.set("limit", params.limit);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return apiFetch(`/api/certificates${suffix}`);
  },

  /** Public verification (no auth). */
  verify(certificateNumber) {
    return apiFetch(`/api/certificates/verify/${certificateNumber}`);
  },
};

export default certificateService;
