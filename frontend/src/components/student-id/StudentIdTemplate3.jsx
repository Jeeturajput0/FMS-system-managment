import React from "react";
import {
  brandLogo,
  courseName,
  emailOf,
  FakeBarcode,
  formatDate,
  fullAddress,
  phoneOf,
  TemplatePhoto,
  val,
} from "./idCardHelpers";

/**
 * TEMPLATE 3 — Corporate Cyan (PORTRAIT 54 x 85.6mm)
 * Cyan curved header, overlapping circular photo, centered
 * name, detail rows, bottom barcode. Terms + dates on back.
 *
 * NOTE: front AND back both render inside the standard
 * `.sid sid-portrait sid-t3` shell so the gallery, modal
 * preview and print all share the exact 54/85.6 ratio.
 */
export default function StudentIdTemplate3({ student, side = "front" }) {
  if (!student) return null;

  if (side === "back") {
    return (
      <div className="sid sid-portrait sid-t3">
        <div className="sid-t3-back">
          <h2 className="sid-t3-back-title">Terms &amp; Conditions</h2>

          <ul className="sid-t3-back-points">
            <li>
              Carry this ID card at all times during working hours for
              <strong> identification and verification</strong> purposes.
            </li>
            <li>
              The card is <strong>non-transferable</strong> and should not be
              shared or used for unauthorized purposes.
            </li>
            <li>
              If found, please <strong>return it</strong> to the
              administration office.
            </li>
          </ul>

          <div className="sid-t3-back-dates">
            <div>
              <span>Join</span>
              <strong>: {formatDate(student.joiningDate)}</strong>
            </div>
            <div>
              <span>Expiry</span>
              <strong>
                : {student.expiryDate ? formatDate(student.expiryDate) : "NO EXPIRY"}
              </strong>
            </div>
          </div>

          <div className="sid-t3-back-foot">
            <div className="sid-t3-back-logo">
              <img src={brandLogo} alt="AI Scholars" />
            </div>
            <p>
              AI Scholars
              <br />
              International Co.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sid sid-portrait sid-t3">
      <div className="sid-t3-top">
        <div className="sid-t3-brand">
          <img src={brandLogo} alt="Institute logo" />
          <span>
            AI Scholars
            <br />
            International Co.
          </span>
        </div>

        <TemplatePhoto
          student={student}
          className="sid-t3-photo"
          imgClassName="sid-t3-photo-img"
        />
      </div>

      <div className="sid-t3-body">
        <h2 className="sid-t3-name">{val(student.name)}</h2>
        <p className="sid-t3-course">{courseName(student)}</p>

        <div className="sid-t3-rows">
          <div>
            <span>ID</span>
            <strong>: {val(student.studentId)}</strong>
          </div>
          <div>
            <span>D.O.B</span>
            <strong>: {formatDate(student.dob || student.dateOfBirth)}</strong>
          </div>
          <div>
            <span>Phone</span>
            <strong>: {phoneOf(student)}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>: {emailOf(student)}</strong>
          </div>
          <div>
            <span>Address</span>
            <strong>: {fullAddress(student)}</strong>
          </div>
        </div>

        <div className="sid-t3-barcode">
          <FakeBarcode value={student.studentId} className="sid-t3-bars" />
          <span>{val(student.studentId)}</span>
        </div>
      </div>
    </div>
  );
}
