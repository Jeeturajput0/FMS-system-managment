import { StudentIdCardView } from "../components/StudentIdCardModal";
import { isPortraitTemplate } from "../components/student-id/templates";
import { chunkPairs } from "./printChunk";

/**
 * ID-card print pages — sab kuch A4 size me.
 * - Single student: FRONT poore A4 page-1 par, BACK poore A4 page-2 par.
 *   Portrait template -> A4 portrait, landscape template -> A4 landscape.
 * - Bulk: har A4 sheet par multiple cards (cutting sheet), page orientation
 *   template ke hisaab se. Har card break-inside:avoid ke saath.
 * - Last page kabhi blank extra page nahi banata.
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

/** One student — FRONT fills full A4 page 1, BACK fills full A4 page 2. */
export function SingleIdPrintPage({ student, template }) {
  if (!student) return null;
  const landscape = !isPortraitTemplate(template);
  const pageClass = `id-card-a4-page${landscape ? " id-card-a4-landscape" : ""}`;
  const cardClass = `id-card-print-full ${
    landscape ? "id-card-print-full-landscape" : "id-card-print-full-portrait"
  }`;
  return (
    <div className="id-card-print-root">
      <div className={pageClass}>
        <div className={cardClass}>
          <StudentIdCardView student={student} side="front" template={template} />
        </div>
      </div>
      <div className={pageClass}>
        <div className={cardClass}>
          <StudentIdCardView student={student} side="back" template={template} />
        </div>
      </div>
    </div>
  );
}

/**
 * Bulk print: pairs = [{ student, template }].
 * Prints FRONT + BACK for every student.
 * Page orientation template se: landscape template -> landscape page.
 */
export function BulkIdPrintPages({ pairs = [] }) {
  const clean = pairs.filter((p) => p?.student);
  const landscape = clean.length > 0 && !isPortraitTemplate(clean[0].template);
  const pages = chunkPairs(clean, landscape ? 4 : 4);
  if (!pages.length) return null;
  return (
    <div className="id-card-print-root">
      {pages.map((pagePairs, pageIndex) => (
        <div
          key={pageIndex}
          className={`id-card-a4-page${landscape ? " id-card-a4-landscape" : ""}`}
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
