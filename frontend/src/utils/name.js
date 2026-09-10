export const NAME_PATTERN = "[\\p{L}][\\p{L} .'-]*";

export const sanitizeNameInput = (value) =>
  String(value || "").replace(/[^\p{L} .'-]/gu, "");
