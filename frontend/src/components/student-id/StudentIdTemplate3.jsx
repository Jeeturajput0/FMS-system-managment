import React from "react";
import {
  brandLogo,
  courseName,
  emailOf,
  FakeBarcode,
  formatDate,
  phoneOf,
  TemplatePhoto,
  val,
} from "./idCardHelpers";

/**
 * TEMPLATE 3 — Corporate Cyan (portrait)
 * Cyan top, navy body, circular photo, name + course + contacts,
 * barcode at bottom. Terms & Conditions + join/expire on back.
 */
export default function StudentIdTemplate3({ student, side = "front" }) {
  if (!student) return null;

  if (side === "back") {
    return (
      <div className="sid sid-portrait sid-t3">
        <div className="sid-t3-back">
          <h2 className="sid-t3-back-title">TERMS &amp; CONDITIONS</h2>
          <ul className="sid-t3-back-points">
            <li>
              <strong>Identification:</strong> Carry the ID card at all times
              during working hours for identification purposes.
            </li>
            <li>
              <strong>Authorized Use:</strong> The card is strictly for official
              use and should not be shared or used for unauthorized purposes.
            </li>
          </ul>

          <div className="sid-t3-back-dates">
            <div>
              <span>Join</span>
              <strong>:{formatDate(student.joiningDate)}</strong>
            </div>
            <div>
              <span>Expire</span>
              <strong>:—</strong>
            </div>
          </div>
        </div>

        <div className="sid-t3-back-foot">
          <div className="sid-t3-back-logo">
            <img src={brandLogo} alt="Institute logo" />
          </div>
          <p>
            AI Scholars
            <br />
            International Co.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="sid sid-portrait sid-t3">
      <div className="sid-t3-top">
        <div className="sid-t3-brand">
          <img src={brandLogo} alt="Institute logo" />
         
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
            <span>ID No</span>
            <strong>: {val(student.studentId)}</strong>
          </div>
          <div>
            <span>E-mail</span>
            <strong>: {emailOf(student)}</strong>
          </div>
          <div>
            <span>Phone</span>
            <strong>: {phoneOf(student)}</strong>
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
