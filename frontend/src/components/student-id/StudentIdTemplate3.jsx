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
    <div className={cardClass}>
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0525] via-[#291269] to-[#5130cf]" />

      {/* =================================================
          LARGE YELLOW CURVE
      ================================================= */}

      <div
        className="
          absolute
          -left-[245px]
          -top-[155px]
          h-[690px]
          w-[660px]
          rotate-[7deg]
          rounded-[50%]
          bg-[#ffdc55]
        "
      />

      {/* Purple inner cut */}
      <div
        className="
          absolute
          -left-[225px]
          -top-[135px]
          h-[590px]
          w-[590px]
          rotate-[7deg]
          rounded-[50%]
          bg-[#281067]
        "
      />

      {/* =================================================
          BOTTOM YELLOW SWOOSH
      ================================================= */}

      <div
        className="
          absolute
          -left-[145px]
          bottom-[3px]
          h-[105px]
          w-[555px]
          rotate-[8deg]
          rounded-[50%]
          bg-[#ffdc55]
        "
      />

      {/* Inner purple cut */}
      <div
        className="
          absolute
          -left-[120px]
          bottom-[35px]
          h-[66px]
          w-[515px]
          rotate-[8deg]
          rounded-[50%]
          bg-[#35167e]
        "
      />

      {/* =================================================
          DECORATIVE CIRCLE
      ================================================= */}

      <div
        className="
          absolute
          bottom-[19px]
          left-[318px]
          h-[70px]
          w-[70px]
          rounded-full
          bg-gradient-to-br
          from-[#ffe77b]
          to-[#bd9c2c]
          opacity-95
        "
      />

      {/* =================================================
          RIGHT YELLOW BORDER
      ================================================= */}

      <div
        className="
          absolute
          -right-[285px]
          -top-[185px]
          h-[860px]
          w-[380px]
          rounded-full
          border-[18px]
          border-[#ffdc55]
        "
      />

      {/* Inner subtle curve */}
      <div
        className="
          absolute
          -right-[270px]
          -top-[170px]
          h-[830px]
          w-[355px]
          rounded-full
          border-[2px]
          border-yellow-100/20
        "
      />

      {/* =================================================
          STUDENT PHOTO
      ================================================= */}

      <div className="absolute left-[48px] top-[73px] z-20">
        {/* Outer dark purple oval */}
        <div
          className="
            h-[286px]
            w-[236px]
            rounded-[50%]
            bg-[#25105f]
            p-[10px]
            shadow-[0_15px_35px_rgba(0,0,0,0.35)]
          "
        >
          {/* Yellow / white ring */}
          <div
            className="
              h-full
              w-full
              rounded-[50%]
              bg-gradient-to-br
              from-yellow-300
              via-white
              to-yellow-400
              p-[3px]
            "
          >
            <div className="h-full w-full overflow-hidden rounded-[50%] bg-slate-200">
              <TemplatePhoto
                student={student}
                className="h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
            </div>
          </div>
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