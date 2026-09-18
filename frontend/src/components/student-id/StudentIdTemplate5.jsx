import React from "react";
import { Phone } from "lucide-react";
import {
  emailOf,
  FakeBarcode,
  formatDateUS,
  fullAddress,
  phoneOf,
  TemplatePhoto,
  val,
  validUntilPlus2US,
} from "./idCardHelpers";

/**
 * TEMPLATE 5 — School Cream (PORTRAIT 54 x 85.6mm)
 * Cream background, mauve top/bottom bands, gold pill,
 * centered photo, Name / ID / Email / Address rows, barcode.
 * Back: TERMS & CONDITIONS + validity + contact rows.
 */
export default function StudentIdTemplate5({ student, side = "front" }) {
  if (!student) return null;

  if (side === "back") {
    return (
      <div className="sid sid-portrait sid-t5">
        <div className="sid-t5-band sid-t5-band-top" aria-hidden="true" />
        <div className="sid-t5-band sid-t5-band-bottom" aria-hidden="true" />

        <div className="sid-t5-back">
          <div className="sid-t5-terms">
            <h2 className="sid-t5-terms-title">TERMS &amp; CONDITIONS</h2>
            <ul>
              <li>
                This card is the property of AI Scholars. If found, please
                return it to the institute&apos;s main office.
              </li>
              <li>
                This card is valid only during the student&apos;s active
                enrollment period.
              </li>
              <li>Misuse of this card may result in disciplinary action.</li>
            </ul>
          </div>

          <dl className="sid-t5-valid-rows">
            <div>
              <dt>Valid From</dt>
              <dd>: {formatDateUS(student.joiningDate)}</dd>
            </div>
            <div>
              <dt>Valid Until</dt>
              <dd>: {validUntilPlus2US(student)}</dd>
            </div>
          </dl>

          <p className="sid-t5-return">
            If found, please return to
            <br />
            AI Scholars Main Office.
          </p>

          <div className="sid-t5-contact">
            <div>
              <Phone style={{ width: "4.5cqi", height: "4.5cqi" }} />
              <span>{phoneOf(student)}</span>
            </div>
            <div>
              <span>www.aischolars.example.com</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sid sid-portrait sid-t5">
      <div className="sid-t5-band sid-t5-band-top" aria-hidden="true" />
      <div className="sid-t5-band sid-t5-band-bottom" aria-hidden="true" />

      <h2 className="sid-t5-school">AI Scholars</h2>
      <p className="sid-t5-school-sub">STUDENT ID CARD</p>

      <div className="sid-t5-pill">Student ID Card</div>

      <TemplatePhoto
        student={student}
        className="sid-t5-photo"
        imgClassName="sid-t5-photo-img"
      />

      <h3 className="sid-t5-name">{val(student.name)}</h3>

      <dl className="sid-t5-rows">
        <div>
          <dt>ID</dt>
          <dd>: {val(student.studentId)}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>: {emailOf(student)}</dd>
        </div>
        <div className="sid-t5-addr">
          <dt>Address</dt>
          <dd>: {fullAddress(student)}</dd>
        </div>
      </dl>

      <FakeBarcode value={student.studentId} className="sid-t5-bars" />
      <p className="sid-t5-bars-id">{val(student.studentId)}</p>
    </div>
  );
}
