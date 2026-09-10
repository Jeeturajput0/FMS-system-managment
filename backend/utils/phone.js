export const PHONE_NUMBER_PATTERN = /^[0-9]{10}$/;

export const isValidPhoneNumber = (value) =>
  PHONE_NUMBER_PATTERN.test(String(value ?? "").trim());

export const phoneValidationMessage = "Phone number must be exactly 10 digits";
