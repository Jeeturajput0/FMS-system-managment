import { useState } from "react";
import { apiFetch } from "../utils/api";

const keyOf = (s) => String(s?._id || s?.id || s?.mongoId || s?.studentId || "");

/**
 * Shared hook: single + bulk ID cards.
 *   const { idCard, makeIdCard, closeIdCard,
 *           bulk, toggleSelect, isSelected, openBulkCards, closeBulkCards, clearSelection } = useStudentIdCard();
 */
export const useStudentIdCard = () => {
  const [idCard, setIdCard] = useState({
    open: false,
    student: null,
    loading: false,
    error: "",
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulk, setBulk] = useState({ open: false, students: [], loading: false, error: "" });

  const closeIdCard = () =>
    setIdCard({ open: false, student: null, loading: false, error: "" });

  const makeIdCard = async (student) => {
    const id = student?._id || student?.id || student?.mongoId;
    if (!id) {
      setIdCard({ open: true, student, loading: false, error: "" });
      return;
    }
    setIdCard({ open: true, student: null, loading: true, error: "" });
    try {
      const response = await apiFetch(`/api/students/${id}`);
      setIdCard({
        open: true,
        student: response.student || response.data || student,
        loading: false,
        error: "",
      });
    } catch (requestError) {
      if (student?.name) {
        setIdCard({ open: true, student, loading: false, error: "" });
      } else {
        setIdCard({
          open: true,
          student: null,
          loading: false,
          error: requestError.message || "Unable to load the student ID card.",
        });
      }
    }
  };

  // ---------- bulk ----------
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
  const closeBulkCards = () => setBulk({ open: false, students: [], loading: false, error: "" });

  /** Selected rows (full objects) ko fresh detail ke sath bulk modal me kholo */
  const openBulkCards = async (allStudents = []) => {
    const map = new Map(allStudents.map((s) => [keyOf(s), s]));
    const picked = selectedIds.map((k) => map.get(k)).filter(Boolean);
    if (!picked.length) return;
    setBulk({ open: true, students: [], loading: true, error: "" });
    try {
      const full = await Promise.all(
        picked.map(async (s) => {
          const id = s?._id || s?.id || s?.mongoId;
          if (!id) return s;
          try {
            const r = await apiFetch(`/api/students/${id}`);
            return r.student || r.data || s;
          } catch {
            return s; // fallback list data
          }
        })
      );
      setBulk({ open: true, students: full, loading: false, error: "" });
    } catch (e) {
      setBulk({ open: true, students: picked, loading: false, error: "" });
    }
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
  };
};

export default useStudentIdCard;
