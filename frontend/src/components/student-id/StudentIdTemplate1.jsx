import React from "react";
import {
  brandLogo,
  courseName,
  formatDate,
  phoneOf,
  TemplatePhoto,
  val,
  validUntil,
} from "./idCardHelpers";

/**
 * TEMPLATE 1 — Classic Blue (LANDSCAPE 85.6 x 54mm)
 * White background, blue geometric top/bottom, logo at top,
 * photo left + details right, Terms & Conditions on back.
 */
export default function StudentIdTemplate1({ student, side = "front" }) {
  if (!student) return null;

  if (side === "back") {
    return (
      <div className="sid sid-landscape sid-t1">
        <div className="sid-t1-shape sid-t1-shape-top" aria-hidden="true" />
        <div className="sid-t1-shape sid-t1-shape-side" aria-hidden="true" />

        <div className="sid-t1-back">
          <div className="sid-t1-brand">
            <img src={brandLogo} alt="Institute logo" />
          </div>

          <h2 className="sid-t1-title">TERMS &amp; CONDITIONS</h2>

          <ol className="sid-t1-terms">
            <li>
              The card is strictly personal and may not be transferred, lent,
              or used by any other individual.
            </li>
            <li>
              Any lost or damaged card must be reported immediately to the
              administration office.
            </li>
            <li>
              The card is valid only during the student&apos;s active enrollment
              period and must be returned upon graduation or withdrawal.
            </li>
          </ol>

          <div className="sid-t1-back-contact">
            <span className="sid-t1-pill">www.aischolars.example.com</span>
            <span className="sid-t1-pill">hello@aischolars.example.com</span>
          </div>
        </div>

        <div className="sid-t1-shape sid-t1-shape-bottom" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="sid sid-landscape sid-t1">
      <div className="sid-t1-shape sid-t1-shape-top" aria-hidden="true" />
      <div className="sid-t1-shape sid-t1-shape-side" aria-hidden="true" />

      <div className="sid-t1-front">
        <div className="sid-t1-brand">
          <img src={brandLogo} alt="Institute logo" />
        </div>

        <div className="sid-t1-body">
          <TemplatePhoto
            student={student}
            className="sid-t1-photo"
            imgClassName="sid-t1-photo-img"
          />

          <div className="sid-t1-info">
            <dl className="sid-t1-rows">
              <div>
                <dt>Name</dt>
                <dd>: {val(student.name)}</dd>
              </div>
              <div>
                <dt>ID</dt>
                <dd>: {val(student.studentId)}</dd>
              </div>
              <div>
                <dt>D.O.B</dt>
                <dd>: {formatDate(student.dob)}</dd>
              </div>
              <div>
                <dt>Class</dt>
                <dd>: {courseName(student)}</dd>
              </div>
              <div>
                <dt>Valid Until</dt>
                <dd>: {validUntil(student)}</dd>
              </div>
              <div>
                <dt>Mobile</dt>
                <dd>: {phoneOf(student)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="sid-t1-shape sid-t1-shape-bottom" aria-hidden="true" />
    </div>
  );
}
