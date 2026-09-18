import { StudentIdCardView } from "../components/StudentIdCardModal";
import { isPortraitTemplate } from "../components/student-id/templates";
import { chunkPairs } from "./printChunk";

/**
 * ID-card print pages (A4 portrait) — Tailwind + .id-card-* CSS.
 * - Every card keeps its exact physical size:
 *   portrait 54mm x 85.6mm, landscape 85.6mm x 54mm.
 * - Front immediately followed by back, so each student's pair
 *   stays adjacent; each card has break-inside:avoid.
 * - 4 pairs (8 cards) per A4 page; overflow flows to next page.
 * - Last page never forces a trailing blank page.
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

/** One student (FRONT + BACK) centered on an A4 portrait page. */
export function SingleIdPrintPage({ student, template }) {
  if (!student) return null;
  return (
    <div className="id-card-print-root">
      <div className="id-card-print-single">
        <PrintCard student={student} side="front" template={template} />
        <PrintCard student={student} side="back" template={template} />
      </div>
    </div>
  );
}

/**
 * Bulk print: pairs = [{ student, template }].
 * Prints FRONT + BACK for every student on A4 portrait grid pages.
 */
export function BulkIdPrintPages({ pairs = [] }) {
  const pages = chunkPairs(pairs.filter((p) => p?.student), 4);
  if (!pages.length) return null;
  return (
    <div className="id-card-print-root">
      {pages.map((pagePairs, pageIndex) => (
        <div key={pageIndex} className="id-card-a4-page">
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
