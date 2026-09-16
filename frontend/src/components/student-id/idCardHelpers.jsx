import { useState } from "react";
import { assetUrl } from "../../utils/api";
import brandLogo from "../../../assist/logo.png";

export { brandLogo };

/* =========================
   Shared dynamic-data helpers
   (same logic as the existing ID card)
========================= */

export const formatDate = (value) => {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return String(value || "—");
  }
};

export const val = (item, fallback = "—") => {
  if (item === 0) return "0";
  return item || fallback;
};

export const fullAddress = (student) => {
  if (!student) return "—";
  if (student.address) return student.address;
  const address = [student.city, student.state, student.pincode]
    .filter(Boolean)
    .join(", ");
  return address || "—";
};

export const courseName = (student) =>
  student?.courseId?.title ||
  student?.courseId?.name ||
  student?.course ||
  "—";

export const phoneOf = (student) =>
  val(student?.mobile || student?.phone);

export const emailOf = (student) => val(student?.email);

/** Valid-until = joining date + 1 year, shown as "Month YYYY". */
export const validUntil = (student) => {
  if (!student?.joiningDate) return "—";
  try {
    const d = new Date(student.joiningDate);
    if (Number.isNaN(d.getTime())) return "—";
    d.setFullYear(d.getFullYear() + 1);
    return new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return "—";
  }
};

/** US-style date "MM/DD/YYYY" (school template back side). */
export const formatDateUS = (value) => {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  } catch {
    return String(value || "—");
  }
};

/** Valid-until = joining date + 2 years, shown as "MM/DD/YYYY". */
export const validUntilPlus2US = (student) => {
  if (!student?.joiningDate) return "—";
  try {
    const d = new Date(student.joiningDate);
    if (Number.isNaN(d.getTime())) return "—";
    d.setFullYear(d.getFullYear() + 2);
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  } catch {
    return "—";
  }
};

/* =========================
   Student photo with fallback initial
========================= */

export function TemplatePhoto({ student, className = "", imgClassName = "" }) {
  const [err, setErr] = useState(false);
  const initial =
    String(student?.name || "S").trim().charAt(0).toUpperCase() || "S";

  if (student?.photo && !err) {
    return (
      <div className={className}>
        <img
          src={assetUrl(student.photo)}
          alt={student?.name || "Student"}
          className={imgClassName}
          onError={() => setErr(true)}
        />
      </div>
    );
  }
  return (
    <div className={className} data-fallback="true">
      <span>{initial}</span>
    </div>
  );
}

/* =========================
   Fake barcode (pure CSS, deterministic per student id)
========================= */

export function FakeBarcode({ value = "", className = "", dark = false }) {
  const seed = String(value || "0000");
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 997;
  }
  return (
    <div className={className}>
      <div
        aria-hidden="true"
        style={{
          height: "100%",
          width: "100%",
          backgroundImage: `repeating-linear-gradient(90deg,
            ${dark ? "#0f172a" : "#111827"} 0 ${(hash % 3) + 1}px,
            transparent ${(hash % 3) + 1}px ${(hash % 3) + 3}px,
            ${dark ? "#0f172a" : "#111827"} ${(hash % 3) + 3}px ${(hash % 5) + 5}px,
            transparent ${(hash % 5) + 5}px ${(hash % 7) + 8}px)`,
        }}
      />
    </div>
  );
}

/* =========================
   Sample data — ONLY for the template gallery preview
========================= */

export const SAMPLE_STUDENT = {
  name: "Jeetu Rajput",
  studentId: "ZI0926S002",
  course: "Data Science",
  dob: "2000-09-16",
  mobile: "9876543210",
  phone: "9876543210",
  email: "jeetu.rajput@example.com",
  gender: "Male",
  bloodGroup: "O+",
  fatherName: "Ramesh Rajput",
  address: "123 Anywhere St., Any City",
  city: "Any City",
  state: "",
  pincode: "",
  joiningDate: "2025-07-25",
  photo: "",
};
