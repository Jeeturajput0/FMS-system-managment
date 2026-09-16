import React from "react";
import { QRCodeSVG } from "qrcode.react";
import logo from "../../../assist/logo.png";
import { formatLongDate } from "./certificateTemplates";
import "./certificate.css";

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
 * Pure dynamic AI SCHOLARS completion certificate (landscape).
 * No hardcoded student data — everything comes via props.
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
    <div className="cert" role="img" aria-label={`Certificate of completion for ${studentName}`}>
      {/* corner decorations */}
      <div className="cert-corner cert-corner-tr" aria-hidden="true" />
      <div className="cert-corner cert-corner-bl" aria-hidden="true" />
      <div className="cert-frame" aria-hidden="true" />

      {/* header row */}
      <div className="cert-head">
        <div className="cert-logo">
          <img src={logo} alt="AI Scholars" />
        </div>
        <div className="cert-head-right">
          <p className="cert-id">
            Certificate ID: <span>{certificateNumber || "—"}</span>
          </p>
          <div className="cert-iso" aria-hidden="true">
            <span className="cert-iso-top">CERTIFIED</span>
            <span className="cert-iso-mid">ISO 9001</span>
            <span className="cert-iso-bot">ISO 9001:2015</span>
          </div>
        </div>
      </div>

      {/* titles */}
      <h1 className="cert-title">CERTIFICATE</h1>
      <h2 className="cert-sub">OF COMPLETION</h2>
      <p className="cert-presented">proudly presented to</p>
      <p className="cert-name">{studentName || "—"}</p>

      {/* dynamic description */}
      <p className="cert-desc">{highlight(description, [studentName, courseName])}</p>

      {/* footer row */}
      <div className="cert-foot">
        <div className="cert-sign">
          <span className="cert-for">For AI SCHOLARS</span>
          <span className="cert-script">Vikas Gupta</span>
          <strong>VIKAS GUPTA</strong>
          <span>Founder</span>
        </div>
        <div className="cert-sign">
          <span className="cert-for">For AI SCHOLARS</span>
          <span className="cert-script">Umesh Rajput</span>
          <strong>UMESH RAJPUT</strong>
          <span>Co-Founder</span>
        </div>
        <div className="cert-qr">
          {verifyUrl ? (
            <QRCodeSVG value={verifyUrl} width="100%" height="100%" />
          ) : (
            <span className="cert-qr-ph">QR</span>
          )}
          <span className="cert-qr-cap">Scan to verify</span>
        </div>
      </div>

      {issueDate ? (
        <p className="cert-issue">Issued on {formatLongDate(issueDate)}</p>
      ) : null}
    </div>
  );
}
