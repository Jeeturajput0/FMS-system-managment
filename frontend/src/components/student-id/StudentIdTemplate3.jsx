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

/* =========================================================
   CARD SIZE
   Preview: 760px × 480px
   Aspect ratio: 1.583 : 1
========================================================= */

const CARD_WIDTH = "w-[760px]";
const CARD_HEIGHT = "h-[480px]";

const cardClass = `
  relative
  ${CARD_WIDTH}
  ${CARD_HEIGHT}
  shrink-0
  overflow-hidden
  rounded-[4px]
  bg-[#24105f]
  shadow-2xl
  print:shadow-none
`;

const getDob = (student) =>
  student?.dob ||
  student?.dateOfBirth ||
  student?.birthDate ||
  "";

const getAddress = (student) =>
  student?.address ||
  student?.fullAddress ||
  student?.currentAddress ||
  "—";

const getFranchiseName = (student) =>
  student?.franchise?.name ||
  student?.franchiseName ||
  student?.coachingName ||
  "AI Scholars";

export default function StudentIdTemplate3({
  student,
  side = "front",
}) {
  if (!student) return null;

  /* =========================================================
     BACK SIDE
  ========================================================= */

  if (side === "back") {
    return (
      <div className={cardClass}>
        {/* Base Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#100626] via-[#291267] to-[#5632d3]" />

        {/* =================================================
            LEFT DARK CURVE
        ================================================= */}

        <div
          className="
            absolute
            -left-[230px]
            -top-[150px]
            h-[760px]
            w-[430px]
            rounded-full
            bg-[#0b061e]
          "
        />

        {/* Yellow left curve */}
        <div
          className="
            absolute
            -left-[185px]
            -top-[120px]
            h-[700px]
            w-[350px]
            rounded-full
            border-[18px]
            border-[#ffdc55]
          "
        />

        {/* =================================================
            RIGHT YELLOW CURVE
        ================================================= */}

        <div
          className="
            absolute
            -right-[275px]
            -top-[185px]
            h-[850px]
            w-[375px]
            rounded-full
            border-[18px]
            border-[#ffdc55]
          "
        />

        <div
          className="
            absolute
            -right-[260px]
            -top-[170px]
            h-[820px]
            w-[350px]
            rounded-full
            border-[3px]
            border-yellow-100/20
          "
        />

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="relative z-10 flex h-full flex-col items-center px-[85px] pt-[55px]">
          {/* Small brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white p-1.5 shadow-lg">
              <img
                src={brandLogo}
                alt="AI Scholars"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="text-left">
              <p className="text-[13px] font-black text-white">
                AI Scholars
              </p>

              <p className="text-[7px] font-bold uppercase tracking-[0.22em] text-yellow-300">
                International Co.
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mt-[18px] text-center">
            <h2 className="text-[43px] font-black uppercase leading-[0.95] tracking-tight text-white">
              Terms &amp;
              <br />
              Conditions
            </h2>

            <div className="mx-auto mt-[12px] h-[4px] w-[55px] rounded-full bg-[#ffdc55]" />
          </div>

          {/* Terms */}
          <div className="mt-[22px] w-full max-w-[570px] text-center">
            <p className="text-[12px] font-medium leading-[1.5] text-slate-200">
              Carry this ID card at all times during working
              hours for identification and verification
              purposes. This card is strictly for official use.
            </p>

            <p className="mt-[16px] text-[12px] font-medium leading-[1.5] text-slate-200">
              The card is non-transferable and should not be
              shared or used for unauthorized purposes. If
              found, please return it to the administration.
            </p>
          </div>

          {/* =================================================
              DATES
          ================================================= */}

          <div className="mt-[22px] flex items-center gap-[35px]">
            <div className="min-w-[120px] text-center">
              <p className="text-[8px] font-black uppercase tracking-[0.22em] text-yellow-300">
                Join Date
              </p>

              <p className="mt-[4px] text-[13px] font-bold text-white">
                {formatDate(student.joiningDate) || "N/A"}
              </p>
            </div>

            <div className="h-[30px] w-px bg-white/30" />

            <div className="min-w-[120px] text-center">
              <p className="text-[8px] font-black uppercase tracking-[0.22em] text-yellow-300">
                Expiry Date
              </p>

              <p className="mt-[4px] text-[13px] font-bold text-white">
                {student.expiryDate
                  ? formatDate(student.expiryDate)
                  : "NO EXPIRY"}
              </p>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="absolute bottom-[23px] left-0 right-0 flex justify-center">
            <div className="flex items-center gap-[10px]">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white p-[7px] shadow-lg">
                <img
                  src={brandLogo}
                  alt="AI Scholars"
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="text-[13px] font-black text-white">
                  AI Scholars
                </p>

                <p className="text-[7px] font-medium uppercase tracking-[0.2em] text-yellow-300">
                  International Co.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     FRONT SIDE
  ========================================================= */

  return (
    <div className="sid sid-portrait sid-t3">
      <div className="sid-t3-top">
        <div className="sid-t3-brand">
          <img src={brandLogo} alt="Institute logo" />
         
        </div>
      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="absolute left-[320px] right-[67px] top-[69px] z-20">
        {/* =================================================
            BRAND
        ================================================= */}

        <div className="flex items-center gap-[12px]">
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white p-[8px] shadow-lg">
            <img
              src={brandLogo}
              alt="AI Scholars"
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <p className="text-[19px] font-black leading-none text-white">
              AI Scholars
            </p>

            <p className="mt-[4px] text-[7px] font-bold uppercase tracking-[0.28em] text-yellow-300">
              International Co.
            </p>
          </div>
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <h1 className="mt-[23px] text-[40px] font-black uppercase leading-none tracking-tight text-white">
          Student ID Card
        </h1>

        {/* Yellow underline */}
        <div className="mt-[9px] h-[4px] w-[58px] rounded-full bg-yellow-300" />

        {/* =================================================
            STUDENT DETAILS
        ================================================= */}

        <div className="mt-[17px] space-y-[5px]">
          {/* Name */}
          <div className="flex items-baseline">
            <span className="w-[82px] shrink-0 text-[17px] font-black text-yellow-300">
              Name:
            </span>

            <span className="min-w-0 flex-1 truncate text-[16px] font-semibold text-white">
              {val(student.name)}
            </span>
          </div>

          {/* ID */}
          <div className="flex items-baseline">
            <span className="w-[82px] shrink-0 text-[17px] font-black text-yellow-300">
              ID:
            </span>

            <span className="min-w-0 flex-1 truncate text-[16px] font-semibold text-white">
              {val(student.studentId)}
            </span>
          </div>

          {/* DOB */}
          <div className="flex items-baseline">
            <span className="w-[82px] shrink-0 text-[17px] font-black text-yellow-300">
              D.O.B:
            </span>

            <span className="min-w-0 flex-1 truncate text-[16px] font-semibold text-white">
              {getDob(student)
                ? formatDate(getDob(student))
                : "—"}
            </span>
          </div>

          {/* Course */}
          <div className="flex items-baseline">
            <span className="w-[82px] shrink-0 text-[17px] font-black text-yellow-300">
              Course:
            </span>

            <span className="min-w-0 flex-1 truncate text-[16px] font-semibold text-white">
              {courseName(student)}
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-baseline">
            <span className="w-[82px] shrink-0 text-[17px] font-black text-yellow-300">
              Phone:
            </span>

            <span className="min-w-0 flex-1 truncate text-[16px] font-semibold text-white">
              {phoneOf(student)}
            </span>
          </div>
        </div>

        {/* =================================================
            ADDRESS
        ================================================= */}

        <div className="mt-[4px] flex items-start">
          <span className="w-[82px] shrink-0 text-[17px] font-black text-yellow-300">
            Address:
          </span>

          <span className="line-clamp-2 text-[14px] font-medium leading-[1.35] text-white">
            {getAddress(student)}
          </span>
        </div>

        {/* =================================================
            EMAIL
        ================================================= */}

        <div className="mt-[4px] flex items-baseline">
          <span className="w-[82px] shrink-0 text-[17px] font-black text-yellow-300">
            Email:
          </span>

          <span className="min-w-0 truncate text-[13px] font-medium text-white">
            {emailOf(student)}
          </span>
        </div>
      </div>

      {/* =================================================
          BOTTOM INFORMATION
      ================================================= */}

      <div className="absolute bottom-[18px] right-[67px] z-20 flex items-end gap-[18px]">
        {/* Issued by */}
        <div className="max-w-[160px]">
          <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-yellow-300">
            Issued By
          </p>

          <p className="mt-[3px] truncate text-[10px] font-black text-white">
            {getFranchiseName(student)}
          </p>
        </div>

        {/* Barcode */}
        <div className="rounded-[4px] bg-white px-[7px] py-[5px] shadow-lg">
          <FakeBarcode
            value={student.studentId}
            className="h-[27px] w-[112px]"
          />

          <p className="mt-[2px] text-center text-[6px] font-bold tracking-[0.18em] text-slate-700">
            {val(student.studentId)}
          </p>
        </div>
      </div>
    </div>
  );
}