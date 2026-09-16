import React from "react";
import { Globe, Phone } from "lucide-react";
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
 * TEMPLATE 5 — School Cream (landscape)
 * Cream background, mauve top/bottom bands, gold "Student ID Card" pill,
 * photo + barcode left, Name / ID / Email / Address rows right.
 * Back: TERMS & CONDITIONS + barcode, Valid From / Valid Until,
 * return note and contact rows.
 */
export default function StudentIdTemplate5({ student, side = "front" }) {
  if (!student) return null;

  if (side === "back") {
    return (
      <div className="sid sid-landscape sid-t5">
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

          <div className="sid-t5-valid">
            <FakeBarcode value={student.studentId} className="sid-t5-bars" />
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
                <span className="sid-t5-ico">
                  <Phone width="65%" height="65%" />
                </span>
                <span>{phoneOf(student)}</span>
              </div>
              <div>
                <span className="sid-t5-ico">
                  <Globe width="65%" height="65%" />
                </span>
                <span>www.aischolars.example.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sid-t5-deco" aria-hidden="true">
          <span className="sid-t5-deco-slash" />
        </div>
      </div>
    );
  }

  return (
    <div className="sid sid-landscape sid-t5">
      <div className="sid-t5-band sid-t5-band-top" aria-hidden="true" />
      <div className="sid-t5-band sid-t5-band-bottom" aria-hidden="true" />

      <h2 className="sid-t5-school">AI Scholars</h2>

      <div className="sid-t5-front">
        <div className="sid-t5-left">
          <TemplatePhoto
            student={student}
            className="sid-t5-photo"
            imgClassName="sid-t5-photo-img"
          />
          <FakeBarcode value={student.studentId} className="sid-t5-bars" />
        </div>

        <div className="sid-t5-right">
          <div className="sid-t5-pill">Student ID Card</div>
          <dl className="sid-t5-rows">
            <div>
              <dt>Name</dt>
              <dd>: {val(student.name)}</dd>
            </div>
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
        </div>
      </div>
    </div>
  );
}
