export const PHONE_NUMBER_PATTERN = "[0-9]{10}";

export const sanitizePhoneInput = (value) =>
  String(value || "").replace(/\D/g, "").slice(0, 10);

export const isValidPhoneNumber = (value) => /^\d{10}$/.test(String(value || "").trim());
