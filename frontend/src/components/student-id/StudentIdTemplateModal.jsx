import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, CreditCard, X } from "lucide-react";
import { SAMPLE_STUDENT } from "./idCardHelpers";
import { TEMPLATE_COMPONENTS, TEMPLATE_META } from "./templates";
import "./StudentIdCard.css";

/**
 * StudentIdTemplateModal — "Select ID Card Template" gallery.
 *
 * Shows REAL miniature previews (rendered with sample data).
 * Sample data is ONLY for the gallery — the actual ID card
 * always uses the real selected student's data.
 */
export default function StudentIdTemplateModal({
  open,
  selectedTemplate,
  onSelect,
  onContinue,
  onClose,
  studentCount = 1,
}) {
  const [error, setError] = React.useState("");

  if (!open) return null;

  const handleContinue = () => {
    if (!selectedTemplate) {
      setError("Please select a template to continue.");
      return;
    }
    setError("");
    onContinue?.();
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Select ID card template"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        {/* ---------- Header ---------- */}
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
              <CreditCard size={20} className="text-blue-600" />
              Select ID Card Template
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Choose a design for your student ID card
              {studentCount > 1
                ? ` — this template will apply to all ${studentCount} selected students.`
                : "."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close template selection"
          >
            <X size={20} />
          </button>
        </div>

        {/* ---------- Gallery ---------- */}
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
          {TEMPLATE_META.filter((meta) => TEMPLATE_COMPONENTS[meta.id]).map((meta) => {
            const PreviewComponent = TEMPLATE_COMPONENTS[meta.id];
            const selected = selectedTemplate === meta.id;
            return (
              <motion.button
                key={meta.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                animate={selected ? { scale: 1.02 } : { scale: 1 }}
                onClick={() => {
                  onSelect?.(meta.id);
                  setError("");
                }}
                aria-pressed={selected}
                className={`group relative rounded-2xl border-2 bg-slate-50 p-3 text-left transition-all ${
                  selected
                    ? "border-blue-600 ring-4 ring-blue-100"
                    : "border-slate-200 hover:border-blue-300 hover:shadow-lg"
                }`}
              >
                {/* Selected check */}
                <span
                  className={`absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                    selected
                      ? "bg-blue-600 text-white"
                      : "bg-white text-transparent ring-1 ring-slate-300 group-hover:ring-blue-300"
                  }`}
                >
                  <Check size={16} strokeWidth={3} />
                </span>

                {/* Real miniature preview (sample data only) */}
                <span className="sid-preview block overflow-hidden rounded-xl">
                  <PreviewComponent student={SAMPLE_STUDENT} side="front" />
                </span>

                <span className="mt-3 flex items-center justify-between px-1 pb-1">
                  <span>
                    <span className="block text-sm font-black text-slate-900">
                      {meta.name}
                    </span>
                    <span className="block text-[11px] font-medium text-slate-500">
                      {meta.description} · {meta.orientation}
                    </span>
                  </span>
                  <span
                    className={`rounded-lg px-3 py-1.5 text-xs font-black ${
                      selected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700"
                    }`}
                  >
                    {selected ? "Selected" : "Select"}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>

        {error && (
          <p className="px-5 text-center text-xs font-bold text-red-600 sm:px-7">
            {error}
          </p>
        )}

        {/* ---------- Footer ---------- */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            Continue / Preview ID Card
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
