import React from "react";
import { QRCodeSVG } from "qrcode.react";
import logo from "../../../assist/logo.png";
import { formatLongDate } from "./certificateTemplates";
import "./Certificate.css";

/** Bold the student + course names inside the plain description string. */
const highlight = (text = "", names = []) => {
  const parts = [];
  let rest = String(text);
  let key = 0;
  while (rest) {
    let earliest = -1;
    let matchName = "";
    names.filter(Boolean).forEach((n) => {
      const i = rest.toLowerCase().indexOf(String(n).toLowerCase());
      if (i !== -1 && (earliest === -1 || i < earliest)) {
        earliest = i;
        matchName = rest.slice(i, i + String(n).length);
      }
    });
    if (earliest === -1) {
      parts.push(<React.Fragment key={key++}>{rest}</React.Fragment>);
      break;
    }
    if (earliest > 0) parts.push(<React.Fragment key={key++}>{rest.slice(0, earliest)}</React.Fragment>);
    parts.push(<strong key={key++}>{matchName}</strong>);
    rest = rest.slice(earliest + matchName.length);
  }
  return parts;
};

/**
 * Shrink type slightly when content is long so NOTHING is ever
 * clipped: no truncate, no line-clamp on critical text.
 */
const nameSizeFor = (name = "") => {
  const len = String(name).length;
  if (len > 42) return "2.5cqw";
  if (len > 28) return "3.0cqw";
  return "3.6cqw";
};

const descSizeFor = (text = "") => {
  const len = String(text).length;
  if (len > 520) return "1.8cqw";
  if (len > 380) return "2.0cqw";
  return "2.25cqw";
};

/**
 * Pure dynamic AI SCHOLARS completion certificate.
 * Sizing uses cqw (container-query width) units so the SAME component
 * is exact at any container width: in print the wrapper is 297mm wide,
 * therefore aspect 297/210 => exactly 297mm x 210mm (A4 landscape).
 * On screen it scales down proportionally inside the preview modal.
 *
 * Layout guarantees:
 * - logo, certificate ID, ISO badge, headings, student name,
 *   FULL description (wraps, shrinks, never clipped),
 *   course/dates, both signatures, QR, border and decorations
 *   are all visible — nothing overflows the gold border.
 */
export default function CertificateView({
  certificateNumber = "",
  studentName = "",
  courseName = "",
  startDate = null,
  completionDate = null,
  issueDate = null,
  description = "",
  verifyUrl = "",
}) {
  return (
    <div
      role="img"
      aria-label={`Certificate of completion for ${studentName}`}
      className="certificate-template relative aspect-[297/210] w-full overflow-hidden bg-white text-center text-[#111827] shadow-[0_16px_40px_#0f172a2e] [font-family:Georgia,'Times_New_Roman',serif] [background:repeating-radial-gradient(ellipse_120%_90%_at_50%_120%,#00000008_0_2px,transparent_2px_9px),repeating-radial-gradient(ellipse_120%_90%_at_50%_-20%,#00000006_0_2px,transparent_2px_9px),#ffffff]"
    >
      {/* thin gold inner border */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-[4.5%_3.5%] border-[0.45cqw] border-[#c9a227] [outline:0.18cqw_solid_#c9a227] [outline-offset:0.9cqw]" />

      {/* gold + black curved corners */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-[10%] -top-[14%] h-[34%] w-[46%] rotate-[8deg] [background:linear-gradient(115deg,transparent_55%,#c9a227_55%_60%,#1a1a1a_60%_78%,#c9a227_78%_82%,transparent_82%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-[14%] -left-[10%] h-[34%] w-[46%] rotate-[8deg] [background:linear-gradient(115deg,transparent_18%,#c9a227_18%_22%,#1a1a1a_22%_40%,#c9a227_40%_45%,transparent_45%)]" />

      {/* header: logo left, ID + ISO right */}
      <div className="relative flex items-start justify-between px-[8%] pt-[7%]">
        <div className="flex aspect-[1.15] w-[17%] items-center justify-center rounded-[1.2cqw] bg-gradient-to-br from-[#0d84b4] to-[#073f5c] p-[1.2cqw]">
          <img src={logo} alt="AI Scholars" className="w-[88%] object-contain brightness-0 invert" />
        </div>
        <div className="flex items-start gap-[2.5cqw]">
          <p className="m-0 whitespace-nowrap font-sans text-[2.9cqw] font-extrabold text-black">
            Certificate ID: <span>{certificateNumber || "—"}</span>
          </p>
          {/* ISO seal (pure Tailwind + CSS gradient, no image asset) */}
          <div aria-hidden="true" className="flex h-[11cqw] w-[11cqw] shrink-0 flex-col items-center justify-center rounded-full font-sans leading-[1.15] text-[#3d2f04] shadow [background:radial-gradient(circle,#f7e08b_0_52%,#c9a227_52%_64%,#8a6d1c_64%_72%,#c9a227_72%_100%)]">
            <span className="text-[1.15cqw] font-extrabold tracking-[0.08em]">CERTIFIED</span>
            <span className="text-[2.3cqw] font-black">ISO 9001</span>
            <span className="text-[1.05cqw] font-bold">ISO 9001:2015</span>
          </div>
        </div>
      </div>

      {/* titles */}
      <h1 className="mb-0 ml-[0.28em] mt-[2.5cqw] font-sans text-[7.2cqw] font-black tracking-[0.28em] text-black">
        CERTIFICATE
      </h1>
      <h2 className="mb-0 mt-[0.6cqw] font-sans text-[2.7cqw] font-extrabold tracking-[0.12em] text-black">
        OF COMPLETION
      </h2>
      <p className="mb-0 mt-[1.2cqw] text-[2.2cqw] italic text-[#6b7280]">proudly presented to</p>

      {/* student name — wraps to 2 lines max, shrinks when long, never cut */}
      <p
        className="certificate-student-name mx-auto mt-[0.8cqw] inline-block min-w-[44%] max-w-[84%] border-b-[0.3cqw] border-black px-[2cqw] pb-[1cqw] font-sans font-bold text-black"
        style={{ fontSize: nameSizeFor(studentName) }}
      >
        {studentName || "—"}
      </p>

      {/* dynamic description — wraps naturally, shrinks when long, never clipped */}
      <p
        className="certificate-description mx-auto mb-0 mt-[2cqw] max-w-[82%] font-sans leading-[1.65] text-[#1f2937]"
        style={{ fontSize: descSizeFor(description) }}
      >
        {highlight(description, [studentName, courseName])}
      </p>

      {/* footer: signatures + QR */}
      <div className="absolute inset-x-[9%] bottom-[7.5%] flex items-end justify-between font-sans">
        <div className="flex min-w-[24%] flex-col items-center">
          <span className="text-[1.5cqw] italic text-[#7c6fd0]">For AI SCHOLARS</span>
          <span className="rotate-[-4deg] text-[3.6cqw] leading-[1.3] text-[#333] [font-family:'Segoe_Script','Brush_Script_MT',cursive]">
            Vikas Gupta
          </span>
          <strong className="text-[1.9cqw] tracking-[0.04em] text-black">VIKAS GUPTA</strong>
          <span className="text-[1.7cqw] text-[#4b5563]">Founder</span>
        </div>
        <div className="flex min-w-[24%] flex-col items-center">
          <span className="text-[1.5cqw] italic text-[#7c6fd0]">For AI SCHOLARS</span>
          <span className="rotate-[-4deg] text-[3.6cqw] leading-[1.3] text-[#333] [font-family:'Segoe_Script','Brush_Script_MT',cursive]">
            Umesh Rajput
          </span>
          <strong className="text-[1.9cqw] tracking-[0.04em] text-black">UMESH RAJPUT</strong>
          <span className="text-[1.7cqw] text-[#4b5563]">Co-Founder</span>
        </div>
        <div className="flex w-[13%] flex-col items-center gap-[0.8cqw]">
          {verifyUrl ? (
            <QRCodeSVG value={verifyUrl} width="100%" height="100%" className="aspect-square w-full border-[0.4cqw] border-black bg-white p-[0.6cqw]" />
          ) : (
            <span className="flex aspect-square w-full items-center justify-center border-[0.4cqw] border-dashed border-[#9ca3af] text-[2.4cqw] font-extrabold text-[#9ca3af]">
              QR
            </span>
          )}
          <span className="text-[1.5cqw] text-[#4b5563]">Scan to verify</span>
        </div>
      </div>

      {issueDate ? (
        <p className="absolute inset-x-0 bottom-[2.2%] m-0 font-sans text-[1.5cqw] text-[#9ca3af]">
          Issued on {formatLongDate(issueDate)}
        </p>
      ) : null}
    </div>
  );
}
