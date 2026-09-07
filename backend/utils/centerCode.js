const meaningfulWords = (name = "") =>
  String(name)
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

export const normalizeCenterCode = (code = "") =>
  String(code)
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const generateCenterCode = (name, date = new Date()) => {
  const words = meaningfulWords(name);
  const initials = words.length > 1
    ? words.map((word) => word[0]).join("")
    : (words[0] || "CENTER").slice(0, 4);
  const value = date instanceof Date ? date : new Date(date);
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const year = String(value.getFullYear()).slice(-2);
  return `${initials.toUpperCase()}-${month}-${year}`;
};

export const generateUniqueCenterCode = async (Coaching, baseCode, excludeId = null) => {
  const normalized = normalizeCenterCode(baseCode);
  let candidate = normalized;
  let suffix = 2;
  const filter = (code) => ({ code, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
  while (await Coaching.exists(filter(candidate))) candidate = `${normalized}-${suffix++}`;
  return candidate;
};
