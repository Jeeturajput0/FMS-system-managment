import { TEMPLATE_META } from "../../components/student-id/templates";

/**
 * Course-based certificate template selection (frontend mirror).
 * Priority: course.certificateTemplate (DB) -> keyword auto-detect -> template-1.
 * Unknown ids fall back to template-1 so preview never breaks.
 */

export const CERTIFICATE_TEMPLATE_IDS = [
  "template-1",
  "template-2",
  "template-3",
  "template-4",
  "template-5",
  "legacy",
];

const KNOWN = new Set(CERTIFICATE_TEMPLATE_IDS);

export const templateGroupOf = (course) => {
  const title = String(course?.title || course?.name || "").toLowerCase();
  const has = (...words) => words.some((w) => title.includes(w));
  if (has("backend", "node", "express", "mongo", "mern", "full stack", "fullstack", "java", "spring", "php", "laravel", "django", "api")) return "backend";
  if (has("python", "data science", "data analys", "machine learning", "artificial intelligence", "cyber", "cloud", "devops")) return "data";
  if (has("graphic", "ui", "ux", "photoshop", "figma", "video edit")) return "design";
  if (has("market", "digital", "seo", "social media", "business", "tally", "account")) return "marketing";
  if (has("frontend", "front-end", "react", "angular", "vue", "web design", "web develop", "javascript")) return "frontend";
  return "general";
};

const BY_GROUP = {
  frontend: "template-1",
  backend: "template-2",
  data: "template-3",
  design: "template-4",
  marketing: "template-5",
  general: "template-1",
};

export const resolveCertificateTemplate = (course) => {
  const configured = String(course?.certificateTemplate || "").trim();
  if (KNOWN.has(configured)) return configured;
  return BY_GROUP[templateGroupOf(course)] || "template-1";
};

export const certificateTemplateName = (id) =>
  TEMPLATE_META.find((t) => t.id === id)?.name ||
  (id === "legacy" ? "Legacy" : "Classic Blue");

/* ---------- description templates with placeholders ---------- */

const DESCRIPTIONS = {
  frontend:
    "This is to certify that [STUDENT_NAME] has successfully completed the [COURSE_NAME] Course at AI Scholars from [START_DATE] to [COMPLETION_DATE], with dedication and consistent performance throughout the program.",
  backend:
    "This is to certify that [STUDENT_NAME] has successfully completed the [COURSE_NAME] Course at AI Scholars from [START_DATE] to [COMPLETION_DATE], with strong technical skills and consistent performance throughout the program.",
  data: "This is to certify that [STUDENT_NAME] has successfully completed the [COURSE_NAME] Course at AI Scholars from [START_DATE] to [COMPLETION_DATE], with strong analytical skills and consistent performance throughout the program.",
  design:
    "This is to certify that [STUDENT_NAME] has successfully completed the [COURSE_NAME] Course at AI Scholars from [START_DATE] to [COMPLETION_DATE], with creativity and consistent performance throughout the program.",
  marketing:
    "This is to certify that [STUDENT_NAME] has successfully completed the [COURSE_NAME] Course at AI Scholars from [START_DATE] to [COMPLETION_DATE], with strong practical skills and consistent performance throughout the program.",
  general:
    "This is to certify that [STUDENT_NAME] has successfully completed the [COURSE_NAME] Course at AI Scholars from [START_DATE] to [COMPLETION_DATE], with dedication and consistent performance throughout the program.",
};

export const fillDescription = (template, map = {}) =>
  String(template || "").replace(
    /\[STUDENT_NAME\]|\[COURSE_NAME\]|\[START_DATE\]|\[COMPLETION_DATE\]|\[CERTIFICATE_ID\]/g,
    (key) => map[key] ?? key
  );

export const courseDescriptionTemplate = (course) =>
  course?.certificateDescription ||
  DESCRIPTIONS[templateGroupOf(course)] ||
  DESCRIPTIONS.general;

/* ---------- dates ---------- */

export const formatLongDate = (value) => {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return "—";
  }
};

export const addDuration = (date, duration) => {
  const d = new Date(date);
  if (Number.isNaN(d?.getTime?.() ?? NaN)) return null;
  const value = Number(duration?.value || 0);
  if (!value) return null;
  const unit = String(duration?.unit || "months").toLowerCase();
  if (unit.startsWith("day")) d.setDate(d.getDate() + value);
  else if (unit.startsWith("week")) d.setDate(d.getDate() + value * 7);
  else if (unit.startsWith("year")) d.setFullYear(d.getFullYear() + value);
  else d.setMonth(d.getMonth() + value);
  return d;
};

export const currentUserRole = () => {
  try {
    return JSON.parse(localStorage.getItem("ai_scholars_user") || "null")?.role || "";
  } catch {
    return "";
  }
};

export const isSuperAdmin = () => currentUserRole() === "SUPER_ADMIN";
