import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, CreditCard, X } from "lucide-react";
import { SAMPLE_STUDENT } from "./idCardHelpers";
import { TEMPLATE_COMPONENTS, TEMPLATE_META, isPortraitTemplate } from "./templates";
import "./StudentIdCard.css";

/**
 * StudentIdTemplateModal — "Select ID Card Template" gallery.
 *
 * Each template renders as a COMPLETE full ID card preview
 * (portrait 54 x 85.6mm ratio, scaled for screen, never cropped)
 * with its own FRONT / BACK toggle.
 *
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
  const [sides, setSides] = React.useState({});

  if (!open) return null;

  const sideOf = (id) => sides[id] || "front";

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
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        {/* ---------- Header ---------- */}
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
              <CreditCard size={20} className="text-blue-600" />
              Choose ID Card Template
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Every preview below is the complete card (front + back available)
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
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
          {TEMPLATE_META.filter((meta) => TEMPLATE_COMPONENTS[meta.id]).map((meta) => {
            const PreviewComponent = TEMPLATE_COMPONENTS[meta.id];
            const selected = selectedTemplate === meta.id;
            const side = sideOf(meta.id);
            return (
              <div
                key={meta.id}
                className={`relative rounded-2xl border-2 bg-slate-50 p-3 transition-all ${
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
                      : "bg-white text-transparent ring-1 ring-slate-300"
                  }`}
                >
                  <Check size={16} strokeWidth={3} />
                </span>

                {/* Complete full-card preview (sample data only) — Tailwind stage,
                    har template apne asli orientation/size me:
                    portrait (2/3/5) 54×85.6mm, landscape (1/4) 85.6×54mm */}
                <div
                  className={
                    isPortraitTemplate(meta.id)
                      ? "pointer-events-none mx-auto aspect-[54/85.6] w-full max-w-[280px] select-none [&_.sid]:h-full [&_.sid]:w-full [&_.sid]:shadow-[0_6px_18px_#0f172a26]"
                      : "pointer-events-none mx-auto aspect-[85.6/54] w-full max-w-full select-none [&_.sid]:h-full [&_.sid]:w-full [&_.sid]:shadow-[0_6px_18px_#0f172a26]"
                  }
                >
                  <PreviewComponent student={SAMPLE_STUDENT} side={side} />
                </div>

                {/* Front / Back toggle */}
                <div className="mt-3 flex justify-center gap-2">
                  {(["front", "back"]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setSides((cur) => ({ ...cur, [meta.id]: s }))
                      }
                      className={`rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-wider ${
                        side === s
                          ? "bg-slate-900 text-white"
                          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 px-1 pb-1">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black text-slate-900">
                      {meta.name}
                    </span>
                    <span className="block truncate text-[11px] font-medium text-slate-500">
                      {meta.description} · {meta.orientation} ·{" "}
                      {isPortraitTemplate(meta.id) ? "54×85.6mm" : "85.6×54mm"}
                    </span>
                  </span>
                </div>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSelect?.(meta.id);
                    setError("");
                  }}
                  aria-pressed={selected}
                  className={`mt-2 w-full rounded-xl px-3 py-2.5 text-xs font-black transition-colors ${
                    selected
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-blue-100 hover:text-blue-700"
                  }`}
                >
                  {selected ? "Selected ✓" : "Select Template"}
                </motion.button>
              </div>
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
