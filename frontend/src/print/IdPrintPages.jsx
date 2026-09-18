import { StudentIdCardView } from "../components/StudentIdCardModal";
import { isPortraitTemplate } from "../components/student-id/templates";
import { chunkPairs } from "./printChunk";

/**
 * ID-card print pages — A4 paper sirf sheet hai, card hamesha apne
 * ASLI size me rehta hai (kabhi full-A4 stretch nahi).
 * - Single student: FRONT exact size me A4 portrait page-1 ke center me,
 *   BACK exact size me A4 portrait page-2 ke center me.
 *   Portrait card 54mm x 85.6mm, landscape card 85.6mm x 54mm.
 * - Bulk: har A4 portrait sheet par multiple exact-size cards (cutting
 *   sheet), 4 pairs per page; zyada cards par apne-aap naya A4 page.
 * - Card kabhi page me kat-ta nahi (break-inside:avoid); aakhri page ke
 *   baad blank page nahi aata.
 */

const PrintCard = ({ student, side, template }) => (
  <div
    className={`id-card-print-item${
      isPortraitTemplate(template) ? "" : " id-card-print-item-landscape"
    }`}
  >
    <StudentIdCardView student={student} side={side} template={template} />
  </div>
);

/**
 * One student — FRONT + BACK dono EK HI A4 portrait page par (ONE PAGE ONLY),
 * exact physical size me (portrait 54mm x 85.6mm / landscape 85.6mm x 54mm),
 * page ke center me. Card stretch/rotate/crop nahi hota; A4 sirf sheet hai.
 * Sirf ek page div hai, isliye extra/blank page kabhi nahi banta.
 * `print-id-card` class batati hai ki active document ID card hai.
 */
export function SingleIdPrintPage({ student, template }) {
  if (!student) return null;
  return (
    <div className="id-card-print-root print-id-card" id="id-card-print-root">
      <div className="id-card-a4-single">
        <PrintCard student={student} side="front" template={template} />
        <PrintCard student={student} side="back" template={template} />
      </div>
    </div>
  );
}

/**
 * Bulk print: pairs = [{ student, template }].
 * Prints FRONT + BACK for every student at exact physical size on
 * A4 portrait sheets (4 pairs per sheet). Page orientation hamesha
 * portrait — A4 sirf sheet hai.
 */
export function BulkIdPrintPages({ pairs = [] }) {
  const clean = pairs.filter((p) => p?.student);
  const pages = chunkPairs(clean, 4);
  if (!pages.length) return null;
  return (
    <div className="id-card-print-root print-id-card">
      {pages.map((pagePairs, pageIndex) => (
        <div
          key={pageIndex}
          className="id-card-a4-page"
        >
          {pagePairs.map(({ student, template }, i) => (
            <span
              key={student._id || student.studentId || `${pageIndex}-${i}`}
              className="contents"
            >
              <PrintCard student={student} side="front" template={template} />
              <PrintCard student={student} side="back" template={template} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
