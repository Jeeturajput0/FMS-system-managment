import { useState } from "react";
import { apiFetch } from "../utils/api";
import { DEFAULT_TEMPLATE } from "../components/student-id/templates";

const keyOf = (s) => String(s?._id || s?.id || s?.mongoId || s?.studentId || "");

/**
 * Shared hook: single + bulk ID cards with template selection.
 *
 * Flow:
 *   Make ID (single)  -> requestIdCard(student)
 *   Make ID (bulk)    -> requestBulkCards(allStudents)
 *     ...both fetch fresh data, then open the template gallery...
 *   Select template   -> setSelectedTemplate(id)
 *   Continue          -> confirmTemplate() opens the ID card preview
 *                       with the ONE template applied to all students.
 *
 * Legacy direct-open API (makeIdCard / openBulkCards) is preserved
 * so existing callers keep working.
 */
export const useStudentIdCard = () => {
  const [idCard, setIdCard] = useState({
    open: false,
    student: null,
    loading: false,
    error: "",
    template: DEFAULT_TEMPLATE,
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulk, setBulk] = useState({
    open: false,
    students: [],
    loading: false,
    error: "",
    template: DEFAULT_TEMPLATE,
  });

  // ---------- template selection ----------
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATE);
  const [templateModal, setTemplateModal] = useState({
    open: false,
    mode: null, // "single" | "bulk" | null
  });
  const [pendingSingle, setPendingSingle] = useState(null);
  const [pendingBulk, setPendingBulk] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);

  const closeIdCard = () =>
    setIdCard((cur) => ({ ...cur, open: false, student: null, loading: false, error: "" }));

  const closeTemplateModal = () => {
    setTemplateModal({ open: false, mode: null });
    setPendingLoading(false);
  };

  const fetchSingle = async (student) => {
    const id = student?._id || student?.id || student?.mongoId;
    if (!id) return student;
    try {
      const response = await apiFetch(`/api/students/${id}`);
      return response.student || response.data || student;
    } catch {
      return student; // fallback to list data
    }
  };

  // ---------- legacy direct open (preserved) ----------
  const makeIdCard = async (student) => {
    const id = student?._id || student?.id || student?.mongoId;
    if (!id) {
      setIdCard({ open: true, student, loading: false, error: "", template: selectedTemplate });
      return;
    }
    setIdCard({ open: true, student: null, loading: true, error: "", template: selectedTemplate });
    try {
      const response = await apiFetch(`/api/students/${id}`);
      setIdCard({
        open: true,
        student: response.student || response.data || student,
        loading: false,
        error: "",
        template: selectedTemplate,
      });
    } catch (requestError) {
      if (student?.name) {
        setIdCard({ open: true, student, loading: false, error: "", template: selectedTemplate });
      } else {
        setIdCard({
          open: true,
          student: null,
          loading: false,
          error: requestError.message || "Unable to load the student ID card.",
          template: selectedTemplate,
        });
      }
    }
  };

  // ---------- NEW: single flow via template gallery ----------
  const requestIdCard = async (student) => {
    if (!student) return false;
    setPendingLoading(true);
    setTemplateModal({ open: true, mode: "single" });
    const full = await fetchSingle(student);
    setPendingSingle(full);
    setPendingBulk([]);
    setPendingLoading(false);
    return true;
  };

  // ---------- bulk selection (unchanged) ----------
  const toggleSelect = (student) => {
    const key = keyOf(student);
    if (!key) return;
    setSelectedIds((cur) => (cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]));
  };

  const isSelected = (student) => selectedIds.includes(keyOf(student));

  const toggleSelectAll = (students = []) => {
    const keys = students.map(keyOf).filter(Boolean);
    const all = keys.length > 0 && keys.every((k) => selectedIds.includes(k));
    setSelectedIds((cur) => (all ? cur.filter((k) => !keys.includes(k)) : [...new Set([...cur, ...keys])]));
  };

  const clearSelection = () => setSelectedIds([]);
  const closeBulkCards = () =>
    setBulk((cur) => ({ ...cur, open: false, students: [], loading: false, error: "" }));

  const collectPicked = (allStudents = []) => {
    const map = new Map(allStudents.map((s) => [keyOf(s), s]));
    return selectedIds.map((k) => map.get(k)).filter(Boolean);
  };

  /** Legacy: selected rows ko fresh detail ke sath bulk modal me kholo (direct) */
  const openBulkCards = async (allStudents = []) => {
    const picked = collectPicked(allStudents);
    if (!picked.length) return false;
    setBulk({ open: true, students: [], loading: true, error: "", template: selectedTemplate });
    try {
      const full = await Promise.all(picked.map(fetchSingle));
      setBulk({ open: true, students: full, loading: false, error: "", template: selectedTemplate });
    } catch (e) {
      setBulk({ open: true, students: picked, loading: false, error: "", template: selectedTemplate });
    }
    return true;
  };

  // ---------- NEW: bulk flow via template gallery ----------
  const requestBulkCards = async (allStudents = []) => {
    const picked = collectPicked(allStudents);
    if (!picked.length) return false;
    setPendingLoading(true);
    setTemplateModal({ open: true, mode: "bulk" });
    try {
      const full = await Promise.all(picked.map(fetchSingle));
      setPendingBulk(full);
    } catch {
      setPendingBulk(picked);
    }
    setPendingSingle(null);
    setPendingLoading(false);
    return true;
  };

  /**
   * Continue from the template gallery:
   * the ONE selected template is applied to ALL students.
   */
  const confirmTemplate = () => {
    if (!selectedTemplate) return false;
    if (templateModal.mode === "bulk") {
      if (!pendingBulk.length && !pendingLoading) return false;
      setTemplateModal({ open: false, mode: null });
      setBulk({
        open: true,
        students: pendingBulk,
        loading: pendingLoading,
        error: "",
        template: selectedTemplate,
      });
      return true;
    }
    if (!pendingSingle && !pendingLoading) return false;
    setTemplateModal({ open: false, mode: null });
    setIdCard({
      open: true,
      student: pendingSingle,
      loading: pendingLoading,
      error: "",
      template: selectedTemplate,
    });
    return true;
  };

  return {
    idCard,
    makeIdCard,
    closeIdCard,
    setIdCard,
    selectedIds,
    toggleSelect,
    isSelected,
    toggleSelectAll,
    clearSelection,
    bulk,
    openBulkCards,
    closeBulkCards,
    // ----- template-selection flow -----
    selectedTemplate,
    setSelectedTemplate,
    templateModal,
    closeTemplateModal,
    requestIdCard,
    requestBulkCards,
    confirmTemplate,
    pendingLoading,
  };
};

export default useStudentIdCard;
