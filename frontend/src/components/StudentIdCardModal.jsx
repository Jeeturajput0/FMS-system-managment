import React, { useState } from "react";
import { Loader2, Printer, X } from "lucide-react";
import { assetUrl } from "../utils/api";
import logo from "../../assist/logo.png";
import "./StudentIdCard.css";

const formatDate = (value) => {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return String(value || "—");
  }
};

const val = (item, fallback = "—") => {
  if (item === 0) return "0";
  return item || fallback;
};

const fullAddress = (s) =>
  s?.address ||
  [s?.address, s?.city, s?.state, s?.pincode].filter(Boolean).join(", ") ||
  "—";

const courseName = (s) =>
  s?.courseId?.title || s?.courseId?.name || s?.course || "—";

const Details = ({ label, children }) => (
  <div className="id-detail">
    <span>{label}</span>
    <strong>{children}</strong>
  </div>
);

const PhotoBox = ({ student }) => {
  const [err, setErr] = useState(false);
  const initial = String(student?.name || "S").trim().charAt(0).toUpperCase() || "S";
  if (student?.photo && !err) {
    return (
      <div className="id-photo">
        <img
          src={assetUrl(student.photo)}
          alt={student?.name || "Student"}
          onError={() => setErr(true)}
        />
      </div>
    );
  }
  return (
    <div className="id-photo">
      <span className="id-photo-initial">{initial}</span>
    </div>
  );
};

/** Pure card — single side, print friendly. side: "front" | "back" */
export function StudentIdCardView({ student, side = "front" }) {
  if (!student) return null;
  return (
    <div className="student-id-card">
      <div className="id-brand">
        <img src={logo} alt="AI Scholars" />
      </div>

      {side === "front" ? (
        <div className="id-front">
          <div className="id-info">
            <h3>{val(student.name)}</h3>
            <div className="id-detail-grid">
              <Details label="ID No.">{val(student.studentId)}</Details>
              <Details label="Joined">{formatDate(student.joiningDate)}</Details>
              <Details label="DOB">{formatDate(student.dob)}</Details>
              <Details label="Mobile">{val(student.mobile || student.phone)}</Details>
            </div>
          </div>
          <PhotoBox student={student} />
        </div>
      ) : (
        <div className="id-back">
          <div className="id-back-details">
            <Details label="Course">{courseName(student)}</Details>
            <Details label="Gender">{val(student.gender, "-")}</Details>
            <Details label="Blood Group">{val(student.bloodGroup, "-")}</Details>
            <Details label="Father's Name">{val(student.fatherName, "-")}</Details>
            <Details label="Address">{fullAddress(student)}</Details>
          </div>
          <div className="id-signature">
            <span className="id-for">For AI SCHOLARS</span>
            <div className="id-sign">Signature</div>
            <b>Auth. Signature</b>
          </div>
        </div>
      )}

      <div className="id-footer">
        Address - shop 5-6, 2nd floor, S-22, Shoe Market, Sanjay Place, Agra - 282002
      </div>
    </div>
  );
}

/**
 * Single student dynamic preview (front/back toggle + print).
 */
export default function StudentIdCardModal({ student, loading, error, onClose }) {
  const [side, setSide] = useState("front");

  return (
    <div
      className="id-modal fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Student ID card preview"
    >
      <div className="id-modal-panel max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="id-controls flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
          <div>
            <h2 className="font-black text-slate-900">Student ID Card</h2>
            <p className="text-xs text-slate-500">
              {student?.name ? `${student.name} · ${student.studentId || ""}` : "Preview both sides before printing."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close preview"
          >
            <X />
          </button>
        </div>

        {loading ? (
          <div className="flex h-80 items-center justify-center gap-2 text-sm font-bold text-slate-500">
            <Loader2 className="animate-spin" /> Loading latest student data...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm font-semibold text-red-600">{error}</div>
        ) : (
          student && (
            <>
              <div className="id-controls flex justify-center gap-2 px-5 pt-5">
                <button
                  onClick={() => setSide("front")}
                  className={`rounded-lg px-4 py-2 text-xs font-black ${
                    side === "front" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  FRONT
                </button>
                <button
                  onClick={() => setSide("back")}
                  className={`rounded-lg px-4 py-2 text-xs font-black ${
                    side === "back" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  BACK
                </button>
              </div>

              <div className="id-print-area id-card-stage p-5 sm:p-8">
                <StudentIdCardView student={student} side={side} />
              </div>

              <div className="id-controls flex justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-7">
                <button
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"
                >
                  <Printer size={16} /> Print ID Card
                </button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}

/**
 * Bulk preview — multiple students, front+back together, one Print click.
 */
export function StudentIdCardBulkModal({ students = [], loading, error, onClose }) {
  return (
    <div
      className="id-modal fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Bulk student ID cards preview"
    >
      <div className="id-modal-panel max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="id-controls flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
          <div>
            <h2 className="font-black text-slate-900">
              ID Cards — {students.length} student{students.length !== 1 ? "s" : ""}
            </h2>
            <p className="text-xs text-slate-500">Front + back sabhi selected students ke — ek sath print honge.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close preview"
          >
            <X />
          </button>
        </div>

        {loading ? (
          <div className="flex h-80 items-center justify-center gap-2 text-sm font-bold text-slate-500">
            <Loader2 className="animate-spin" /> Loading students data...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm font-semibold text-red-600">{error}</div>
        ) : !students.length ? (
          <div className="p-8 text-center text-sm font-semibold text-slate-500">Koi student select nahi hai.</div>
        ) : (
          <>
            <div className="id-print-area id-card-stage p-5 sm:p-8">
              <div className="id-bulk-grid">
                {students.map((s, i) => (
                  <div className="id-bulk-item" key={s._id || s.studentId || i}>
                    <p className="id-bulk-name id-controls">
                      {i + 1}. {s.name} · {s.studentId || ""}
                    </p>
                    <div className="id-bulk-pair">
                      <StudentIdCardView student={s} side="front" />
                      <StudentIdCardView student={s} side="back" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="id-controls sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"
              >
                <Printer size={16} /> Print All ({students.length})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
