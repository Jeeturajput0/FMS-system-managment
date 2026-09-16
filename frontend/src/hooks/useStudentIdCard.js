import { useState } from "react";
import { apiFetch } from "../utils/api";

/**
 * Shared hook: har student list me "Make ID" button ke liye.
 * Usage:
 *   const { idCard, makeIdCard, closeIdCard } = useStudentIdCard();
 *   <button onClick={() => makeIdCard(student)}>Make ID</button>
 *   {idCard.open && <StudentIdCardModal {...idCard} onClose={closeIdCard} />}
 */
export const useStudentIdCard = () => {
  const [idCard, setIdCard] = useState({
    open: false,
    student: null,
    loading: false,
    error: "",
  });

  const closeIdCard = () =>
    setIdCard({ open: false, student: null, loading: false, error: "" });

  const makeIdCard = async (student) => {
    const id = student?._id || student?.id || student?.mongoId;
    // Agar row me already poora data hai to turant preview dikhao,
    // phir fresh data se replace kar do.
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
      // Fallback: list wale data se hi card dikha do taaki teacher/admin
      // permission issue par bhi preview khul jaye.
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

  return { idCard, makeIdCard, closeIdCard, setIdCard };
};

export default useStudentIdCard;
