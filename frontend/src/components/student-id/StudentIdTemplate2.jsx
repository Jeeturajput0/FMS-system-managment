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
 * TEMPLATE 2 — Maroon Gold (PORTRAIT 54 x 85.6mm)
 * Maroon background, gold ring decor, circular photo,
 * white detail sheet with barcode. Info on back.
 */
export default function StudentIdTemplate2({ student, side = "front" }) {
  if (!student) return null;

  if (side === "back") {
    return (
      <div className="sid sid-portrait sid-t2">
        <div className="sid-t2-head">
          <div className="sid-t2-logo">
            <img src={brandLogo} alt="Institute logo" />
          </div>
          <p className="sid-t2-school">AI SCHOLARS</p>
        </div>

        <div className="sid-t2-back">
          <h2 className="sid-t2-title">Additional Information</h2>
          <ul className="sid-t2-points">
            <li>
              This card is the property of AI Scholars. If found, please return
              it to the institute&apos;s main office.
            </li>
            <li>This card is valid only for the current academic year.</li>
            <li>Misuse of this card may result in disciplinary action.</li>
            <li>
              For replacement or inquiries, contact the administration.
            </li>
          </ul>

          <div className="sid-t2-back-contact">
            <span>{phoneOf(student)}</span>
            <span>{emailOf(student)}</span>
            <span>www.aischolars.example.com</span>
          </div>
        </div>

        <div className="sid-t2-foot">@aischolars · AI Scholars</div>
      </div>
    );
  }

  return (
    <div className="sid sid-portrait sid-t2">
      <div className="sid-t2-head">
        <div className="sid-t2-logo">
          <img src={brandLogo} alt="Institute logo" />
        </div>
        <p className="sid-t2-school">AI SCHOLARS</p>
        <p className="sid-t2-sub">STUDENT ID CARD</p>
        <div className="sid-t2-rule" aria-hidden="true" />
      </div>

      <TemplatePhoto
        student={student}
        className="sid-t2-photo"
        imgClassName="sid-t2-photo-img"
      />

      <h2 className="sid-t2-name">{val(student.name)}</h2>
      <p className="sid-t2-course">{courseName(student)}</p>

      <div className="sid-t2-sheet">
        <dl className="sid-t2-rows">
          <div>
            <dt>ID</dt>
            <dd>: {val(student.studentId)}</dd>
          </div>
          <div>
            <dt>D.O.B</dt>
            <dd>: {formatDate(student.dob)}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>: {phoneOf(student)}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>: {emailOf(student)}</dd>
          </div>
          <div className="sid-t2-sheet-addr">
            <dt>Address</dt>
            <dd>: {fullAddress(student)}</dd>
          </div>
        </dl>
        <FakeBarcode value={student.studentId} className="sid-t2-bars" />
        <p className="sid-t2-sheet-id">{val(student.studentId)}</p>
      </div>

      <div className="sid-t2-foot">www.aischolars.example.com</div>
    </div>
  );
}
