import React from "react";
import {
  courseName,
  emailOf,
  formatDate,
  fullAddress,
  phoneOf,
  TemplatePhoto,
  val,
} from "./idCardHelpers";

/**
 * TEMPLATE 2 — Maroon Gold (landscape)
 * Maroon background, gold curved borders, large white content area,
 * circular photo left, details right, Additional Information on back.
 */
export default function StudentIdTemplate2({ student, side = "front" }) {
  if (!student) return null;

  if (side === "back") {
    return (
      <div className="sid sid-landscape sid-t2">
        <div className="sid-t2-ring sid-t2-ring-a" aria-hidden="true" />
        <div className="sid-t2-ring sid-t2-ring-b" aria-hidden="true" />

        <div className="sid-t2-sheet">
          <h2 className="sid-t2-title">Additional Information</h2>
          <ul className="sid-t2-points">
            <li>
              This card is the property of AI Scholars. If found, please return
              it to the institute&apos;s main office.
            </li>
            <li>This card is valid only for the current academic year.</li>
            <li>Misuse of this card may result in disciplinary action.</li>
            <li>
              For replacement or inquiries, contact the administration —{" "}
              {phoneOf(student)} · {emailOf(student)}.
            </li>
          </ul>

          <div className="sid-t2-back-contact">
            <span>{phoneOf(student)}</span>
            <span>{emailOf(student)}</span>
            <span>www.aischolars.example.com</span>
            <span>@aischolars</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sid sid-landscape sid-t2">
      <div className="sid-t2-ring sid-t2-ring-a" aria-hidden="true" />
      <div className="sid-t2-ring sid-t2-ring-b" aria-hidden="true" />

      <div className="sid-t2-sheet sid-t2-front">
        <TemplatePhoto
          student={student}
          className="sid-t2-photo"
          imgClassName="sid-t2-photo-img"
        />

        <div className="sid-t2-info">
          <h2 className="sid-t2-title">School Identification Card</h2>
          <dl className="sid-t2-rows">
            <div>
              <dt>Name</dt>
              <dd>: {val(student.name)}</dd>
            </div>
            <div>
              <dt>Date Of Birth</dt>
              <dd>: {formatDate(student.dob)}</dd>
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
              <dt>Phone</dt>
              <dd>: {phoneOf(student)}</dd>
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
        </div>
      </div>
    </div>
  );
}
