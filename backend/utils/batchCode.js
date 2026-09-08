const initials = (value) => {
  const words = String(value || "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "XX";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.map((word) => word[0]).join("").slice(0, 4).toUpperCase();
};

export const generateBatchCode = ({ franchiseName, courseTitle, startDate }) => {
  const date = startDate ? new Date(startDate) : new Date();
  const validDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const month = String(validDate.getUTCMonth() + 1).padStart(2, "0");
  const year = String(validDate.getUTCFullYear()).slice(-2);
  return `${initials(franchiseName)}${initials(courseTitle)}${month}${year}`;
};
