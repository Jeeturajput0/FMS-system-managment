export const NAME_PATTERN = /^[\p{L}][\p{L}\s.'-]*$/u;

export const isValidName = (value) => NAME_PATTERN.test(String(value ?? "").trim());

export const nameValidationMessage = "Name may contain letters, spaces, apostrophes, dots, and hyphens only";
