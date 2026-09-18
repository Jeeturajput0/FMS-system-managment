import React, { useState } from "react";
import { Loader2, Printer, X } from "lucide-react";
import { assetUrl } from "../utils/api";
import logo from "../../assist/logo.png";
import "./StudentIdCard.css";
import "./student-id/StudentIdCard.css";
import {
  DEFAULT_TEMPLATE,
  isPortraitTemplate,
  resolveTemplate,
} from "./student-id/templates";
import PrintPortal from "../print/PrintPortal";
import { BulkIdPrintPages, SingleIdPrintPage } from "../print/IdPrintPages";
import { usePrint } from "../print/printUtils";

/* =========================
   Helpers (existing logic, unchanged)
========================= */

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

const fullAddress = (student) => {
  if (!student) return "—";

  // If complete address already exists
  if (student.address) {
    return student.address;
  }

  // Otherwise create address from separate fields
  const address = [
    student.city,
    student.state,
    student.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return address || "—";
};

const courseName = (student) =>
  student?.courseId?.title ||
  student?.courseId?.name ||
  student?.course ||
  "—";

/* Portrait stage: 54 x 85.6mm ratio · Landscape stage: 85.6 x 54mm ratio */
const stageClassFor = (template) =>
  `id-card-preview${isPortraitTemplate(template) ? "" : " id-card-preview-landscape"}`;

const dimsFor = (template) =>
  isPortraitTemplate(template) ? "54 × 85.6mm" : "85.6 × 54mm";

/* =========================
   Detail Component (existing, unchanged)
========================= */

const Details = ({ label, children }) => (
  <div className="id-detail">
    <span>{label}</span>
    <strong>{children}</strong>
  </div>
);

/* =========================
   Student Photo (existing, unchanged)
========================= */

const PhotoBox = ({ student }) => {
  const [err, setErr] = useState(false);

  const initial =
    String(student?.name || "S")
      .trim()
      .charAt(0)
      .toUpperCase() || "S";

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

/* =========================================================
   LEGACY SINGLE ID CARD VIEW (original design, preserved)
   Rendered only when template="legacy" is passed.
========================================================= */

export function LegacyStudentIdCardView({ student, side = "front" }) {
  if (!student) return null;

  return (
    <div className="student-id-card">

      {/* =========================
          Logo / Brand
      ========================= */}

      <div className="id-brand">
        <img src={logo} alt="AI Scholars" />
      </div>

      {/* =========================
          FRONT SIDE
      ========================= */}

      {side === "front" ? (
        <div className="id-front">

          <div className="id-info">

            <h3>{val(student.name)}</h3>

            <div className="id-detail-grid">

              <Details label="ID No.">
                {val(student.studentId)}
              </Details>

              <Details label="Joined">
                {formatDate(student.joiningDate)}
              </Details>

              <Details label="DOB">
                {formatDate(student.dob)}
              </Details>

              <Details label="Mobile">
                {val(student.mobile || student.phone)}
              </Details>

            </div>

          </div>

          {/* Student Photo */}
          <PhotoBox student={student} />

        </div>

      ) : (

        /* =========================
           BACK SIDE
        ========================= */

        <div className="id-back">

          <div className="id-back-details">

            <Details label="Course">
              {courseName(student)}
            </Details>

            <Details label="Gender">
              {val(student.gender, "-")}
            </Details>

            <Details label="Blood Group">
              {val(student.bloodGroup, "-")}
            </Details>

            <Details label="Father's Name">
              {val(student.fatherName, "-")}
            </Details>

            <Details label="Address">
              {fullAddress(student)}
            </Details>

          </div>

          {/* Signature */}
          <div className="id-signature">

            <span className="id-for">
              For AI SCHOLARS
            </span>

            <div className="id-sign">
              Signature
            </div>

            <b>
              Auth. Signature
            </b>

          </div>

        </div>
      )}

      {/*
        IMPORTANT:
        Fixed institute address footer removed.
        So front side will NOT show:
        "Address - shop 5-6..."
      */}

    </div>
  );
}

/* =========================================================
   TEMPLATE-AWARE SINGLE ID CARD VIEW
   (keeps the original export name + signature;
   adds an optional `template` prop)
========================================================= */

export function StudentIdCardView({
  student,
  side = "front",
  template = DEFAULT_TEMPLATE,
}) {
  if (!student) return null;

  if (template === "legacy") {
    return <LegacyStudentIdCardView student={student} side={side} />;
  }

  const TemplateComponent = resolveTemplate(template);
  return <TemplateComponent student={student} side={side} />;
}

/* =========================================================
   SINGLE STUDENT ID CARD MODAL (template-driven)
   Accepts:
     student  — single student object
     students — optional array; when 2+ are passed, all are
                rendered FRONT + BACK with the same template
     template — "template-1" | "template-2" | "template-3"
                | "template-4" | "legacy"
========================================================= */

export default function StudentIdCardModal({
  student,
  students = [],
  template = DEFAULT_TEMPLATE,
  loading,
  error,
  onClose,
}) {
  // Print orientation ALWAYS follows the selected template:
  // portrait template -> portrait page, landscape template -> landscape page.
  const orientation = isPortraitTemplate(template) ? "portrait" : "landscape";
  const { printing, handlePrint } = usePrint(orientation);

  const list = Array.isArray(students) ? students.filter(Boolean) : [];
  const isBulk = list.length > 1;
  const activeStudent = student || list[0] || null;

  return (
    <div
      className="id-modal fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Student ID card preview"
    >

      <div className="id-modal-panel max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="id-controls flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">

          <div>
            <h2 className="font-black text-slate-900">
              {isBulk
                ? `ID Cards — ${list.length} students`
                : "Student ID Card"}
            </h2>

            <p className="text-xs text-slate-500">
              {isBulk
                ? "Front + back for every selected student — same template."
                : activeStudent?.name
                  ? `${activeStudent.name} · ${activeStudent.studentId || ""}`
                  : "Preview both sides before printing."}
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

        {/* =========================
            LOADING
        ========================= */}

        {loading ? (

          <div className="flex h-80 items-center justify-center gap-2 text-sm font-bold text-slate-500">

            <Loader2 className="animate-spin" />

            Loading latest student data...

          </div>

        ) : error ? (

          /* =========================
             ERROR
          ========================= */

          <div className="p-8 text-center text-sm font-semibold text-red-600">
            {error}
          </div>

        ) : (
          activeStudent && (
            <>

              {/* FRONT + BACK — hamesha dono, bada preview.
                  Template apne asli size me: portrait->portrait, landscape->landscape. */}

              {/* =========================
                  CARD PREVIEW — bada, template ke asli size me
              ========================= */}

              <div className="id-card-stage p-5 sm:p-8">

                {isBulk ? (
                  <div className="id-bulk-grid">
                    {list.map((item, index) => (
                      <div
                        className="id-bulk-item"
                        key={item._id || item.studentId || index}
                      >
                        <p className="id-bulk-name id-controls">
                          {index + 1}. {item.name} · {item.studentId || ""}
                        </p>
                        <div className="id-bulk-pair">
                          <div className="id-card-front">
                            <span className="id-card-side-label id-controls">FRONT</span>
                            <div className={stageClassFor(template)}>
                              <StudentIdCardView
                                student={item}
                                side="front"
                                template={template}
                              />
                            </div>
                          </div>
                          <div className="id-card-back">
                            <span className="id-card-side-label id-controls">BACK</span>
                            <div className={stageClassFor(template)}>
                              <StudentIdCardView
                                student={item}
                                side="back"
                                template={template}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-start justify-center gap-8">
                      <div className="id-card-front">
                        <span className="id-card-side-label">FRONT — {dimsFor(template)}</span>
                        <div className={`${stageClassFor(template)} id-card-preview-big`}>
                          <StudentIdCardView
                            student={activeStudent}
                            side="front"
                            template={template}
                          />
                        </div>
                      </div>
                      <div className="id-card-back">
                        <span className="id-card-side-label">BACK — {dimsFor(template)}</span>
                        <div className={`${stageClassFor(template)} id-card-preview-big`}>
                          <StudentIdCardView
                            student={activeStudent}
                            side="back"
                            template={template}
                          />
                        </div>
                      </div>
                  </div>
                )}

              </div>

              {/* =========================
                  FOOTER BUTTONS
              ========================= */}

              <div className="id-controls flex justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-7">

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={printing}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                >
                  {printing ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
                  {printing ? "Preparing print..." : isBulk ? `Print All (${list.length})` : "Print ID Card"}
                </button>

              </div>

            </>
          )
        )}

      </div>

      {/* Dedicated print tree (A4 portrait) — mounted before print, hidden on screen */}
      {activeStudent && !loading && !error && (
        <PrintPortal>
          {isBulk ? (
            <BulkIdPrintPages pairs={list.map((item) => ({ student: item, template }))} />
          ) : (
            <SingleIdPrintPage student={activeStudent} template={template} />
          )}
        </PrintPortal>
      )}

    </div>
  );
}

/* =========================================================
   BULK STUDENT ID CARD MODAL (template-driven)
   The ONE selected template is applied to ALL students.
========================================================= */

export function StudentIdCardBulkModal({
  students = [],
  template = DEFAULT_TEMPLATE,
  loading,
  error,
  onClose,
}) {
  const bulkOrientation = isPortraitTemplate(template) ? "portrait" : "landscape";
  const { printing, handlePrint } = usePrint(bulkOrientation);
  const ready = !loading && !error && students.length > 0;
  return (
    <div
      className="id-modal fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Bulk student ID cards preview"
    >

      <div className="id-modal-panel max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="id-controls flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">

          <div>

            <h2 className="font-black text-slate-900">
              ID Cards — {students.length} student
              {students.length !== 1 ? "s" : ""}
            </h2>

            <p className="text-xs text-slate-500">
              Front + back sabhi selected students ke — ek sath print honge.
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

        {/* =========================
            LOADING
        ========================= */}

        {loading ? (

          <div className="flex h-80 items-center justify-center gap-2 text-sm font-bold text-slate-500">

            <Loader2 className="animate-spin" />

            Loading students data...

          </div>

        ) : error ? (

          /* =========================
             ERROR
          ========================= */

          <div className="p-8 text-center text-sm font-semibold text-red-600">
            {error}
          </div>

        ) : !students.length ? (

          /* =========================
             NO STUDENTS
          ========================= */

          <div className="p-8 text-center text-sm font-semibold text-slate-500">
            Koi student select nahi hai.
          </div>

        ) : (

          /* =========================
             STUDENTS (same template for all)
          ========================= */

          <>

            <div className="id-card-stage p-5 sm:p-8">

              <div className="id-bulk-grid">

                {students.map((student, index) => (

                  <div
                    className="id-bulk-item"
                    key={
                      student._id ||
                      student.studentId ||
                      index
                    }
                  >

                    <p className="id-bulk-name id-controls">
                      {index + 1}. {student.name} ·{" "}
                      {student.studentId || ""}
                    </p>

                    <div className="id-bulk-pair">

                      {/* FRONT */}
                      <div className="id-card-front">
                        <span className="id-card-side-label id-controls">FRONT</span>
                        <div className={stageClassFor(template)}>
                          <StudentIdCardView
                            student={student}
                            side="front"
                            template={template}
                          />
                        </div>
                      </div>

                      {/* BACK */}
                      <div className="id-card-back">
                        <span className="id-card-side-label id-controls">BACK</span>
                        <div className={stageClassFor(template)}>
                          <StudentIdCardView
                            student={student}
                            side="back"
                            template={template}
                          />
                        </div>
                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* =========================
                BULK FOOTER
            ========================= */}

            <div className="id-controls sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handlePrint}
                disabled={printing}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
              >
                {printing ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}

                {printing ? "Preparing print..." : `Print All (${students.length})`}

              </button>

            </div>

          </>

        )}

      </div>

      {/* Dedicated print tree (A4 portrait grid) — mounted before print, hidden on screen */}
      {ready && (
        <PrintPortal>
          <BulkIdPrintPages pairs={students.map((s) => ({ student: s, template }))} />
        </PrintPortal>
      )}

    </div>
  );
}
