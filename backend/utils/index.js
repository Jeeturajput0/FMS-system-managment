export const autoGenIdNo = (prefix = "", type = "", count = 1, date = new Date(), appendDate = true) => {
  const value = date instanceof Date ? date : new Date(date);
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const year = String(value.getFullYear()).slice(-2);
  const normalizedPrefix = String(prefix).toUpperCase();
  const hasDateInPrefix = normalizedPrefix.endsWith(`${month}${year}`);
  const datePart = appendDate && !hasDateInPrefix ? `${month}${year}` : "";
  return `${normalizedPrefix}${datePart}${type}${String(count).padStart(3, "0")}`;
};

export const getCenterIdPrefix = (centerCode = "", date = new Date()) => {
  const normalized = String(centerCode).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const value = date instanceof Date ? date : new Date(date);
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const year = String(value.getFullYear()).slice(-2);
  return normalized.endsWith(`${month}${year}`) ? normalized : `${normalized}${month}${year}`;
};

export const getNameInitials = (name = "") => {
  const words = String(name)
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return (words.length > 1
    ? words.map((word) => word[0]).join("")
    : (words[0] || "XX").slice(0, 2)
  ).toUpperCase();
};

export const generateUniqueAutoGenId = async ({ model, field, prefix, type, filter = {}, prefixIncludesDate = false }) => {
  let serial = (await model.countDocuments(filter)) + 1;
  let candidate = autoGenIdNo(prefix, type, serial, new Date(), !prefixIncludesDate);

  while (await model.exists({ [field]: candidate })) {
    serial += 1;
    candidate = autoGenIdNo(prefix, type, serial, new Date(), !prefixIncludesDate);
  }

  return candidate;
};
