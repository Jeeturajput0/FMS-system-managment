import React from "react";
import {
  brandLogo,
  courseName,
  emailOf,
  FakeBarcode,
  formatDate,
  fullAddress,
  TemplatePhoto,
  val,
} from "./idCardHelpers";

/**
 * TEMPLATE 4 — Minimal Beige (LANDSCAPE 85.6 x 54mm)
 * Beige background, navy top/bottom bars, logo + name at top,
 * photo left, details center, barcode right.
 * Back: Student ID Guidelines + join/expire + contact.
 */
export default function StudentIdTemplate4({ student, side = "front" }) {
  if (!student) return null;

  if (side === "back") {
    return (
      <div className="sid sid-landscape sid-t4">
        <div className="sid-t4-bar sid-t4-bar-top" aria-hidden="true" />

        <div className="sid-t4-back-wrap">
          <div className="sid-t4-back-card">
            <h2 className="sid-t4-back-title">Student ID Guidelines</h2>
            <ul className="sid-t4-back-points">
              <li>Always carry this card on campus and produce it on request.</li>
              <li>
                If found, please return to the AI Scholars Main Office —{" "}
                {fullAddress(student)}.
              </li>
            </ul>
          </div>

          <div className="sid-t4-back-side">
            <div className="sid-t4-back-dates">
              <div>
                <span>Join</span>
                <strong>: {formatDate(student.joiningDate)}</strong>
              </div>
              <div>
                <span>Expire</span>
                <strong>: —</strong>
              </div>
            </div>

            <p className="sid-t4-back-note">
              If found, please return to AI Scholars Main Office.
            </p>

            <div className="sid-t4-back-contact">
              <span>{val(student.mobile || student.phone)}</span>
              <span>www.aischolars.example.com</span>
            </div>
          </div>
        </div>

        <div className="sid-t4-bar sid-t4-bar-bottom" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="sid sid-landscape sid-t4">
      <div className="sid-t4-bar sid-t4-bar-top" aria-hidden="true" />

      <div className="sid-t4-front">
        <div className="sid-t4-brand">
          <img src={brandLogo} alt="Institute logo" />
          <span>AI SCHOLARS HIGH SCHOOL</span>
        </div>

        <div className="sid-t4-mid">
          <TemplatePhoto
            student={student}
            className="sid-t4-photo"
            imgClassName="sid-t4-photo-img"
          />

          <dl className="sid-t4-rows">
            <div>
              <dt>Name</dt>
              <dd>: {val(student.name)}</dd>
            </div>
            <div>
              <dt>ID</dt>
              <dd>: {val(student.studentId)}</dd>
            </div>
            <div>
              <dt>Course</dt>
              <dd>: {courseName(student)}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>: {emailOf(student)}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>: {fullAddress(student)}</dd>
            </div>
          </dl>

          <div className="sid-t4-side">
            <FakeBarcode value={student.studentId} className="sid-t4-bars" dark />
            <span>{val(student.studentId)}</span>
          </div>
        </div>
      </div>

      <div className="sid-t4-bar sid-t4-bar-bottom" aria-hidden="true" />
    </div>
  );
}
